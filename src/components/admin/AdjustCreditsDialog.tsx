import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCsrfHeaders } from "@/lib/csrf";
import { Loader2, Plus, Minus } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  credits: number | null;
}

interface AdjustCreditsDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreditsUpdated: () => void;
  onActivityLog?: (targetUserId: string, actionType: string, details: Record<string, unknown>) => Promise<void>;
}

export function AdjustCreditsDialog({
  user,
  open,
  onOpenChange,
  onCreditsUpdated,
  onActivityLog,
}: AdjustCreditsDialogProps) {
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract" | "set">("add");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdjust = async () => {
    if (!user) return;

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    setSaving(true);
    try {
      // Use edge function for secure credit adjustment with proper transaction recording
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error("Authentication required");
        setSaving(false);
        return;
      }

      const response = await supabase.functions.invoke("admin-adjust-credits", {
        body: {
          target_user_id: user.user_id,
          operation,
          amount: numAmount,
          reason: reason || undefined,
        },
        headers: getCsrfHeaders(),
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to adjust credits");
      }

      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || "Failed to adjust credits");
      }

      const operationText =
        operation === "add"
          ? `Added ${numAmount}`
          : operation === "subtract"
          ? `Removed ${numAmount}`
          : `Set to ${numAmount}`;

      toast.success(
        `${operationText} credits for ${user.display_name || "user"}. New balance: ${result.new_credits}`
      );

      // Reset form
      setAmount("");
      setReason("");
      setOperation("add");

      onCreditsUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adjusting credits:", error);
      toast.error(error instanceof Error ? error.message : "Failed to adjust credits");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const currentCredits = user.credits ?? 0;
  const numAmount = parseInt(amount, 10) || 0;
  const previewCredits =
    operation === "add"
      ? currentCredits + numAmount
      : operation === "subtract"
      ? Math.max(0, currentCredits - numAmount)
      : numAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Credits</DialogTitle>
          <DialogDescription>
            Modify credits for {user.display_name || "this user"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <p className="text-xl font-bold">{currentCredits}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">After Adjustment</p>
              <p
                className={`text-xl font-bold ${
                  previewCredits > currentCredits
                    ? "text-green-500"
                    : previewCredits < currentCredits
                    ? "text-red-500"
                    : ""
                }`}
              >
                {previewCredits}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Operation</Label>
            <RadioGroup
              value={operation}
              onValueChange={(v) => setOperation(v as "add" | "subtract" | "set")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add" className="flex items-center gap-1 cursor-pointer">
                  <Plus className="h-4 w-4 text-green-500" />
                  Add
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtract" id="subtract" />
                <Label htmlFor="subtract" className="flex items-center gap-1 cursor-pointer">
                  <Minus className="h-4 w-4 text-red-500" />
                  Subtract
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="set" id="set" />
                <Label htmlFor="set" className="cursor-pointer">
                  Set to
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for adjustment"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdjust} disabled={saving || !amount}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Apply Adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
