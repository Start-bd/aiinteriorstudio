import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { validateSearchQuery } from "@/lib/validation";
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
import { Input } from "@/components/ui/input";
import {
  Users,
  Image,
  CreditCard,
  TrendingUp,
  Shield,
  Trash2,
  Crown,
  Pencil,
  Coins,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { AdjustCreditsDialog } from "@/components/admin/AdjustCreditsDialog";

const USERS_PER_PAGE = 20;

interface SystemStats {
  totalUsers: number;
  totalGenerations: number;
  totalPayments: number;
  activeSubscriptions: number;
}

interface UserWithProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  credits: number | null;
  subscription_tier: string | null;
  total_generations: number | null;
  created_at: string;
  roles: string[];
}

interface ActivityLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

type AppRole = 'admin' | 'moderator' | 'user';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState<UserWithProfile | null>(null);
  const [adjustingCreditsUser, setAdjustingCreditsUser] = useState<UserWithProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin && user) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchActivityLogs();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, currentPage, searchQuery, tierFilter]);

  const fetchStats = async () => {
    try {
      // Use server-side edge function to fetch stats with admin verification
      const { data, error } = await supabase.functions.invoke('admin-stats');
      
      if (error) {
        console.error("Error fetching stats from edge function:", error);
        throw error;
      }
      
      if (data) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalGenerations: data.totalGenerations || 0,
          totalPayments: data.totalPayments || 0,
          activeSubscriptions: data.activeSubscriptions || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch statistics");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const from = (currentPage - 1) * USERS_PER_PAGE;
      const to = from + USERS_PER_PAGE - 1;

      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (searchQuery.trim()) {
        // Validate and sanitize search query
        const validation = validateSearchQuery(searchQuery);
        if (validation.valid && validation.data) {
          query = query.ilike("display_name", `%${validation.data}%`);
        }
      }

      if (tierFilter !== "all") {
        query = query.eq("subscription_tier", tierFilter);
      }

      const { data: profiles, error: profilesError, count } = await query.range(from, to);

      if (profilesError) throw profilesError;

      setTotalUsers(count || 0);

      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map((profile) => ({
        ...profile,
        roles: allRoles
          ?.filter((r) => r.user_id === profile.user_id)
          .map((r) => r.role) || [],
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchActivityLogs = async () => {
    setLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivityLogs((data || []) as ActivityLog[]);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const logAdminActivity = async (
    targetUserId: string | null,
    actionType: string,
    details: Record<string, unknown>
  ) => {
    if (!user) return;
    try {
      await supabase.from("admin_activity_logs").insert([{
        admin_user_id: user.id,
        action_type: actionType,
        target_user_id: targetUserId,
        details: details as Json,
      }]);
      fetchActivityLogs();
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, tierFilter]);

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  const handleGrantRole = async (userId: string, role: AppRole) => {
    const targetUser = users.find(u => u.user_id === userId);
    try {
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role,
        granted_by: user?.id,
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
        user_name: targetUser?.display_name,
        role,
      });

      toast.success(`${role} role granted successfully`);
      fetchUsers();
    } catch (error) {
      console.error("Error granting role:", error);
      toast.error("Failed to grant role");
    }
  };

  const handleRevokeRole = async (userId: string, role: string) => {
    if (userId === user?.id && role === "admin") {
      toast.error("You cannot revoke your own admin role");
      return;
    }

    const targetUser = users.find(u => u.user_id === userId);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as AppRole);

      if (error) throw error;

      await logAdminActivity(userId, "role_revoke", {
        user_name: targetUser?.display_name,
        role,
      });

      toast.success(`${role} role revoked successfully`);
      fetchUsers();
    } catch (error) {
      console.error("Error revoking role:", error);
      toast.error("Failed to revoke role");
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case "role_grant": return "Role Granted";
      case "role_revoke": return "Role Revoked";
      case "credit_adjustment": return "Credits Adjusted";
      case "user_edit": return "User Edited";
      default: return actionType;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "role_grant": return "text-green-500";
      case "role_revoke": return "text-red-500";
      case "credit_adjustment": return "text-amber-500";
      case "user_edit": return "text-blue-500";
      default: return "text-muted-foreground";
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Interior AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Admin Dashboard
                </h1>
              </div>
              <Link to="/admin/security">
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Security Dashboard
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground">
              Manage users, view system statistics, and configure application settings.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalUsers.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Generations
                </CardTitle>
                <Image className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalGenerations.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Payments
                </CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalPayments.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Subscriptions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.activeSubscriptions.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5" />
                  User Management
                  <span className="text-sm font-normal text-muted-foreground">
                    ({totalUsers} users)
                  </span>
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-full sm:w-36">
                      <SelectValue placeholder="All tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tiers</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">User</TableHead>
                        <TableHead className="text-muted-foreground">Tier</TableHead>
                        <TableHead className="text-muted-foreground">Credits</TableHead>
                        <TableHead className="text-muted-foreground">Generations</TableHead>
                        <TableHead className="text-muted-foreground">Roles</TableHead>
                        <TableHead className="text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id} className="border-border">
                          <TableCell>
                            <Link
                              to={`/admin/user/${u.user_id}`}
                              className="hover:underline"
                            >
                              <p className="font-medium text-foreground">
                                {u.display_name || "No name"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(u.created_at).toLocaleDateString()}
                              </p>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                u.subscription_tier === "pro" || u.subscription_tier === "business"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                u.subscription_tier === "pro" || u.subscription_tier === "business"
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              }
                            >
                              {u.subscription_tier || "free"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {u.credits ?? 0}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {u.total_generations ?? 0}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {u.roles.length > 0 ? (
                                u.roles.map((role) => (
                                  <Badge
                                    key={role}
                                    variant="outline"
                                    className={
                                      role === "admin"
                                        ? "border-primary text-primary"
                                        : role === "moderator"
                                        ? "border-accent text-accent"
                                        : "border-border"
                                    }
                                  >
                                    {role === "admin" && <Crown className="h-3 w-3 mr-1" />}
                                    {role}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Link to={`/admin/user/${u.user_id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                  title="View details"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => setEditingUser(u)}
                                title="Edit user"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-amber-500 hover:text-amber-600"
                                onClick={() => setAdjustingCreditsUser(u)}
                                title="Adjust credits"
                              >
                                <Coins className="h-3 w-3" />
                              </Button>
                              <Select
                                onValueChange={(value: string) => handleGrantRole(u.user_id, value as AppRole)}
                              >
                                <SelectTrigger className="w-24 h-8 text-xs">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                              </Select>
                              {u.roles.map((role) => (
                                <Button
                                  key={role}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleRevokeRole(u.user_id, role)}
                                  title={`Revoke ${role} role`}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            {searchQuery ? "No users found matching your search" : "No users found"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to{" "}
                        {Math.min(currentPage * USERS_PER_PAGE, totalUsers)} of {totalUsers}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground px-2">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="bg-card border-border mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5" />
                Admin Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingLogs ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : activityLogs.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No activity logs yet
                </p>
              ) : (
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getActionColor(log.action_type)}`}>
                            {getActionLabel(log.action_type)}
                          </span>
                          {log.details && (
                            <span className="text-sm text-muted-foreground">
                              {(log.details as Record<string, unknown>).user_name as string || "Unknown user"}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.details && log.action_type === "role_grant" && (
                            <span>Granted <Badge variant="outline" className="ml-1">{(log.details as Record<string, unknown>).role as string}</Badge></span>
                          )}
                          {log.details && log.action_type === "role_revoke" && (
                            <span>Revoked <Badge variant="outline" className="ml-1">{(log.details as Record<string, unknown>).role as string}</Badge></span>
                          )}
                          {log.details && log.action_type === "credit_adjustment" && (
                            <span>
                              {(log.details as Record<string, unknown>).operation as string}: {(log.details as Record<string, unknown>).from_credits as number} → {(log.details as Record<string, unknown>).to_credits as number} credits
                              {(log.details as Record<string, unknown>).reason && ` (${(log.details as Record<string, unknown>).reason})`}
                            </span>
                          )}
                          {log.details && log.action_type === "user_edit" && (
                            <span>
                              {Object.keys((log.details as Record<string, unknown>).changes as Record<string, unknown> || {}).join(", ")} updated
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onUserUpdated={fetchUsers}
        onActivityLog={logAdminActivity}
      />

      <AdjustCreditsDialog
        user={adjustingCreditsUser}
        open={!!adjustingCreditsUser}
        onOpenChange={(open) => !open && setAdjustingCreditsUser(null)}
        onCreditsUpdated={fetchUsers}
        onActivityLog={logAdminActivity}
      />
    </>
  );
}
