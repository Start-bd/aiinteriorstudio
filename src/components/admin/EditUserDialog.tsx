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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  credits: number | null;
  subscription_tier: string | null;
  total_generations: number | null;
}

interface EditUserDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  onActivityLog?: (targetUserId: string, actionType: string, details: Record<string, unknown>) => Promise<void>;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
  onActivityLog,
}: EditUserDialogProps) {
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [subscriptionTier, setSubscriptionTier] = useState(
    user?.subscription_tier || "free"
  );
  const [saving, setSaving] = useState(false);

  // Reset form when user changes
  useState(() => {
    if (user) {
      setDisplayName(user.display_name || "");
      setSubscriptionTier(user.subscription_tier || "free");
    }
  });

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const changes: Record<string, { from: unknown; to: unknown }> = {};
      if (displayName.trim() !== (user.display_name || "")) {
        changes.display_name = { from: user.display_name, to: displayName.trim() || null };
      }
      if (subscriptionTier !== (user.subscription_tier || "free")) {
        changes.subscription_tier = { from: user.subscription_tier, to: subscriptionTier };
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          subscription_tier: subscriptionTier,
        })
        .eq("user_id", user.user_id);

      if (error) throw error;

      // Log activity
      if (onActivityLog && Object.keys(changes).length > 0) {
        await onActivityLog(user.user_id, "user_edit", {
          user_name: user.display_name,
          changes,
        });
      }

      toast.success("User profile updated successfully");
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Modify user information and subscription tier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Subscription Tier</Label>
            <Select value={subscriptionTier} onValueChange={setSubscriptionTier}>
              <SelectTrigger id="tier">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Current Stats</Label>
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="font-medium">{user.credits ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Generations</p>
                <p className="font-medium">{user.total_generations ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
