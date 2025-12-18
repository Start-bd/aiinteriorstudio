import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
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
  Users,
  Image,
  CreditCard,
  TrendingUp,
  Shield,
  UserPlus,
  Trash2,
  Crown,
} from "lucide-react";

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

type AppRole = 'admin' | 'moderator' | 'user';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

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
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [profilesRes, imagesRes, paymentsRes, subsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("generated_images").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);

      setStats({
        totalUsers: profilesRes.count || 0,
        totalGenerations: imagesRes.count || 0,
        totalPayments: paymentsRes.count || 0,
        activeSubscriptions: subsRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

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

  const handleGrantRole = async (userId: string, role: AppRole) => {
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

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as AppRole);

      if (error) throw error;

      toast.success(`${role} role revoked successfully`);
      fetchUsers();
    } catch (error) {
      console.error("Error revoking role:", error);
      toast.error("Failed to revoke role");
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
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">
                Admin Dashboard
              </h1>
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
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
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
                            <div>
                              <p className="font-medium text-foreground">
                                {u.display_name || "No name"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(u.created_at).toLocaleDateString()}
                              </p>
                            </div>
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
                            <div className="flex items-center gap-2">
                              <Select
                                onValueChange={(value: string) => handleGrantRole(u.user_id, value as AppRole)}
                              >
                                <SelectTrigger className="w-32 h-8 text-xs">
                                  <SelectValue placeholder="Add role" />
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
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}
