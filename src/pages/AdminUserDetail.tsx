import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Shield,
  Crown,
  Trash2,
  Pencil,
  Coins,
  CreditCard,
  Image,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { AdjustCreditsDialog } from "@/components/admin/AdjustCreditsDialog";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  credits: number | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  total_generations: number | null;
  created_at: string;
  updated_at: string;
  referral_code: string | null;
  preferred_language: string | null;
}

interface CreditTransaction {
  id: string;
  amount: number;
  balance_after: number;
  type: string;
  description: string | null;
  created_at: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_type: string;
  status: string | null;
  credits_added: number | null;
  created_at: string;
  completed_at: string | null;
}

interface Subscription {
  id: string;
  tier: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  created_at: string;
}

interface UserRole {
  role: string;
  created_at: string;
}

type AppRole = "admin" | "moderator" | "user";

export default function AdminUserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/auth");
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin && currentUser) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, currentUser, navigate]);

  useEffect(() => {
    if (isAdmin && userId) {
      fetchUserData();
    }
  }, [isAdmin, userId]);

  const fetchUserData = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        toast.error("User not found");
        navigate("/admin");
        return;
      }
      setUserProfile(profile);

      // Fetch transactions, payments, subscriptions, and roles in parallel
      const [transactionsRes, paymentsRes, subscriptionsRes, rolesRes] = await Promise.all([
        supabase
          .from("credit_transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("payments")
          .select("*")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("user_roles")
          .select("role, created_at")
          .eq("user_id", userId),
      ]);

      if (!transactionsRes.error) setTransactions(transactionsRes.data || []);
      if (!paymentsRes.error) setPayments(paymentsRes.data || []);
      if (!subscriptionsRes.error) setSubscriptions(subscriptionsRes.data || []);
      if (!rolesRes.error) setRoles(rolesRes.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const logAdminActivity = async (
    targetUserId: string | null,
    actionType: string,
    details: Record<string, unknown>
  ) => {
    if (!currentUser) return;
    try {
      await supabase.from("admin_activity_logs").insert([
        {
          admin_user_id: currentUser.id,
          action_type: actionType,
          target_user_id: targetUserId,
          details: details as Json,
        },
      ]);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleGrantRole = async (role: AppRole) => {
    if (!userId || !userProfile) return;
    try {
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role,
        granted_by: currentUser?.id,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("User already has this role");
        } else {
          throw error;
        }
        return;
      }

      await logAdminActivity(userId, "role_grant", {
        user_name: userProfile.display_name,
        role,
      });

      toast.success(`${role} role granted successfully`);
      fetchUserData();
    } catch (error) {
      console.error("Error granting role:", error);
      toast.error("Failed to grant role");
    }
  };

  const handleRevokeRole = async (role: string) => {
    if (!userId) return;
    if (userId === currentUser?.id && role === "admin") {
      toast.error("You cannot revoke your own admin role");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as AppRole);

      if (error) throw error;

      await logAdminActivity(userId, "role_revoke", {
        user_name: userProfile?.display_name,
        role,
      });

      toast.success(`${role} role revoked successfully`);
      fetchUserData();
    } catch (error) {
      console.error("Error revoking role:", error);
      toast.error("Failed to revoke role");
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "generation":
        return "Generation";
      case "purchase":
        return "Purchase";
      case "subscription":
        return "Subscription";
      case "refund":
        return "Refund";
      case "admin_adjustment":
        return "Admin Adjustment";
      case "bonus":
        return "Bonus";
      case "referral":
        return "Referral";
      default:
        return type;
    }
  };

  if (authLoading || roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin || !userProfile) {
    return null;
  }

  const userWithRoles = {
    ...userProfile,
    roles: roles.map((r) => r.role),
  };

  return (
    <>
      <Helmet>
        <title>User Details | Admin | Interior AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/admin">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>

          {/* User Header */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    {userProfile.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.display_name || "User"}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-display font-bold text-foreground">
                      {userProfile.display_name || "Unnamed User"}
                    </h1>
                    <p className="text-sm text-muted-foreground font-mono">
                      {userProfile.user_id}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant={
                          userProfile.subscription_tier === "pro" ||
                          userProfile.subscription_tier === "business"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {userProfile.subscription_tier || "free"}
                      </Badge>
                      {roles.map((r) => (
                        <Badge
                          key={r.role}
                          variant="outline"
                          className={
                            r.role === "admin"
                              ? "border-primary text-primary"
                              : r.role === "moderator"
                              ? "border-accent text-accent"
                              : "border-border"
                          }
                        >
                          {r.role === "admin" && <Crown className="h-3 w-3 mr-1" />}
                          {r.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCreditsDialogOpen(true)}
                    className="text-amber-500 hover:text-amber-600"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Adjust Credits
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Coins className="h-4 w-4" />
                  Credits
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {userProfile.credits ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Image className="h-4 w-4" />
                  Generations
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {userProfile.total_generations ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Calendar className="h-4 w-4" />
                  Joined
                </div>
                <p className="text-lg font-bold text-foreground">
                  {new Date(userProfile.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </div>
                <p className="text-lg font-bold text-foreground">
                  {new Date(userProfile.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Roles Management */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5" />
                Role Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Select onValueChange={(value: string) => handleGrantRole(value as AppRole)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Grant role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                {roles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <div
                        key={r.role}
                        className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-md"
                      >
                        <Badge variant="outline">{r.role}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRevokeRole(r.role)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Credit Transactions */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Coins className="h-5 w-5" />
                Credit Transaction History
                <span className="text-sm font-normal text-muted-foreground">
                  ({transactions.length} transactions)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No credit transactions yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Balance After</TableHead>
                        <TableHead className="text-muted-foreground">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id} className="border-border">
                          <TableCell className="text-foreground whitespace-nowrap">
                            {new Date(tx.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getTransactionLabel(tx.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getTransactionIcon(tx.type, tx.amount)}
                              <span
                                className={
                                  tx.amount > 0 ? "text-green-500" : "text-red-500"
                                }
                              >
                                {tx.amount > 0 ? "+" : ""}
                                {tx.amount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {tx.balance_after}
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-xs truncate">
                            {tx.description || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payments */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5" />
                Payment History
                <span className="text-sm font-normal text-muted-foreground">
                  ({payments.length} payments)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No payments yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Method</TableHead>
                        <TableHead className="text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Credits</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id} className="border-border">
                          <TableCell className="text-foreground whitespace-nowrap">
                            {new Date(payment.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.payment_type}</Badge>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {payment.payment_method}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {payment.amount} {payment.currency.toUpperCase()}
                          </TableCell>
                          <TableCell className="text-foreground">
                            +{payment.credits_added || 0}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "completed" ? "default" : "secondary"
                              }
                              className={
                                payment.status === "completed"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : ""
                              }
                            >
                              {payment.status || "pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscriptions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5" />
                Subscription History
                <span className="text-sm font-normal text-muted-foreground">
                  ({subscriptions.length} subscriptions)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No subscriptions yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Tier</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Period Start</TableHead>
                        <TableHead className="text-muted-foreground">Period End</TableHead>
                        <TableHead className="text-muted-foreground">Cancel at End</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((sub) => (
                        <TableRow key={sub.id} className="border-border">
                          <TableCell>
                            <Badge>{sub.tier}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={sub.status === "active" ? "default" : "secondary"}
                              className={
                                sub.status === "active"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : ""
                              }
                            >
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {sub.current_period_start
                              ? new Date(sub.current_period_start).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {sub.current_period_end
                              ? new Date(sub.current_period_end).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {sub.cancel_at_period_end ? (
                              <Badge variant="destructive">Yes</Badge>
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>

      <EditUserDialog
        user={userWithRoles}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserUpdated={fetchUserData}
        onActivityLog={logAdminActivity}
      />

      <AdjustCreditsDialog
        user={userWithRoles}
        open={creditsDialogOpen}
        onOpenChange={setCreditsDialogOpen}
        onCreditsUpdated={fetchUserData}
        onActivityLog={logAdminActivity}
      />
    </>
  );
}
