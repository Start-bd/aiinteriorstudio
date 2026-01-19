import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Shield,
  AlertTriangle,
  Activity,
  CheckCircle,
  Eye,
  RefreshCw,
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  Image,
} from "lucide-react";
import { format } from "date-fns";

interface SuspiciousPromptLog {
  id: string;
  user_id: string;
  prompt_text: string;
  matched_patterns: string[];
  source: string;
  user_agent: string | null;
  reviewed: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

interface SecurityStats {
  totalSuspiciousPrompts: number;
  unreviewedCount: number;
  reviewedCount: number;
  imageGenerationThreats: number;
  chatThreats: number;
  recentAdminActions: number;
}

export default function AdminSecurity() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [suspiciousPrompts, setSuspiciousPrompts] = useState<SuspiciousPromptLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

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

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [
        { count: totalCount },
        { count: unreviewedCount },
        { count: imageCount },
        { count: chatCount },
        { count: adminActions },
      ] = await Promise.all([
        supabase.from("suspicious_prompt_logs").select("*", { count: "exact", head: true }),
        supabase.from("suspicious_prompt_logs").select("*", { count: "exact", head: true }).eq("reviewed", false),
        supabase.from("suspicious_prompt_logs").select("*", { count: "exact", head: true }).eq("source", "image_generation"),
        supabase.from("suspicious_prompt_logs").select("*", { count: "exact", head: true }).eq("source", "chat"),
        supabase.from("admin_activity_logs").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalSuspiciousPrompts: totalCount || 0,
        unreviewedCount: unreviewedCount || 0,
        reviewedCount: (totalCount || 0) - (unreviewedCount || 0),
        imageGenerationThreats: imageCount || 0,
        chatThreats: chatCount || 0,
        recentAdminActions: adminActions || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchSuspiciousPrompts = useCallback(async () => {
    setLoadingPrompts(true);
    try {
      let query = supabase
        .from("suspicious_prompt_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (reviewFilter === "reviewed") {
        query = query.eq("reviewed", true);
      } else if (reviewFilter === "unreviewed") {
        query = query.eq("reviewed", false);
      }

      if (sourceFilter !== "all") {
        query = query.eq("source", sourceFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSuspiciousPrompts((data || []) as SuspiciousPromptLog[]);
    } catch (error) {
      console.error("Error fetching suspicious prompts:", error);
      toast.error("Failed to fetch suspicious prompts");
    } finally {
      setLoadingPrompts(false);
    }
  }, [reviewFilter, sourceFilter]);

  const fetchActivityLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivityLogs((data || []) as ActivityLog[]);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchActivityLogs();
    }
  }, [isAdmin, fetchStats, fetchActivityLogs]);

  useEffect(() => {
    if (isAdmin) {
      fetchSuspiciousPrompts();
    }
  }, [isAdmin, fetchSuspiciousPrompts]);

  const handleMarkReviewed = async (promptId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("suspicious_prompt_logs")
        .update({
          reviewed: true,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", promptId);

      if (error) throw error;
      toast.success("Marked as reviewed");
      fetchSuspiciousPrompts();
      fetchStats();
    } catch (error) {
      console.error("Error marking as reviewed:", error);
      toast.error("Failed to update");
    }
  };

  const getPatternLabel = (pattern: string) => {
    if (pattern.includes("ignore")) return "Ignore Instructions";
    if (pattern.includes("forget")) return "Forget Training";
    if (pattern.includes("disregard")) return "Disregard Rules";
    if (pattern.includes("you\\s+are\\s+now")) return "Role Override";
    if (pattern.includes("persona|role")) return "Persona Change";
    if (pattern.includes("system:|assistant:")) return "Role Marker";
    if (pattern.includes("override")) return "Override Attempt";
    if (pattern.includes("jailbreak|bypass")) return "Jailbreak";
    if (pattern.includes("pretend")) return "Pretend Prompt";
    if (pattern.includes("do\\s+not\\s+follow")) return "Rule Bypass";
    if (pattern === "excessive_special_chars") return "Encoding Attack";
    return pattern.substring(0, 20) + "...";
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
        <title>Security Dashboard | Interior AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">
                Security Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Monitor suspicious activity, review flagged prompts, and audit admin actions.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Suspicious Prompts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalSuspiciousPrompts || 0}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </CardTitle>
                <Eye className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.unreviewedCount || 0}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Reviewed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.reviewedCount || 0}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Admin Actions
                </CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.recentAdminActions || 0}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="suspicious" className="space-y-6">
            <TabsList>
              <TabsTrigger value="suspicious" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Suspicious Prompts
                {stats?.unreviewedCount ? (
                  <Badge variant="destructive" className="ml-2">
                    {stats.unreviewedCount}
                  </Badge>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <Activity className="h-4 w-4" />
                Audit Logs
              </TabsTrigger>
            </TabsList>

            {/* Suspicious Prompts Tab */}
            <TabsContent value="suspicious">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Flagged Prompts
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select value={reviewFilter} onValueChange={setReviewFilter}>
                        <SelectTrigger className="w-full sm:w-36">
                          <SelectValue placeholder="Review status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="unreviewed">Unreviewed</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sourceFilter} onValueChange={setSourceFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sources</SelectItem>
                          <SelectItem value="image_generation">Image Generation</SelectItem>
                          <SelectItem value="chat">Chat</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          fetchSuspiciousPrompts();
                          fetchStats();
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPrompts ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : suspiciousPrompts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No suspicious prompts found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="text-muted-foreground">Time</TableHead>
                            <TableHead className="text-muted-foreground">Source</TableHead>
                            <TableHead className="text-muted-foreground">Patterns</TableHead>
                            <TableHead className="text-muted-foreground max-w-md">Prompt</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-muted-foreground">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {suspiciousPrompts.map((prompt) => (
                            <TableRow key={prompt.id} className="border-border">
                              <TableCell className="text-foreground whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(new Date(prompt.created_at), "MMM d, HH:mm")}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="gap-1">
                                  {prompt.source === "image_generation" ? (
                                    <Image className="h-3 w-3" />
                                  ) : (
                                    <MessageSquare className="h-3 w-3" />
                                  )}
                                  {prompt.source === "image_generation" ? "Image" : "Chat"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {prompt.matched_patterns.slice(0, 2).map((pattern, i) => (
                                    <Badge key={i} variant="destructive" className="text-xs">
                                      {getPatternLabel(pattern)}
                                    </Badge>
                                  ))}
                                  {prompt.matched_patterns.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{prompt.matched_patterns.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-md">
                                <p className="text-sm text-foreground truncate" title={prompt.prompt_text}>
                                  {prompt.prompt_text.substring(0, 100)}
                                  {prompt.prompt_text.length > 100 && "..."}
                                </p>
                              </TableCell>
                              <TableCell>
                                {prompt.reviewed ? (
                                  <Badge variant="secondary" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Reviewed
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Link to={`/admin/user/${prompt.user_id}`}>
                                    <Button size="sm" variant="ghost" title="Investigate User">
                                      <User className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  {!prompt.reviewed && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMarkReviewed(prompt.id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Mark Reviewed
                                    </Button>
                                  )}
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
            </TabsContent>

            {/* Audit Logs Tab */}
            <TabsContent value="audit">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Activity className="h-5 w-5" />
                      Admin Activity Logs
                    </CardTitle>
                    <Button variant="outline" size="icon" onClick={fetchActivityLogs}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingLogs ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : activityLogs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No activity logs found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="text-muted-foreground">Time</TableHead>
                            <TableHead className="text-muted-foreground">Action</TableHead>
                            <TableHead className="text-muted-foreground">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activityLogs.map((log) => (
                            <TableRow key={log.id} className="border-border">
                              <TableCell className="text-foreground whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(new Date(log.created_at), "MMM d, HH:mm")}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${getActionColor(log.action_type)}`}>
                                  {getActionLabel(log.action_type)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-muted-foreground">
                                  {log.details && (
                                    <span>
                                      {log.details.user_name && (
                                        <span className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          {String(log.details.user_name)}
                                        </span>
                                      )}
                                      {log.details.role && (
                                        <Badge variant="outline" className="ml-2">
                                          {String(log.details.role)}
                                        </Badge>
                                      )}
                                      {log.details.amount !== undefined && (
                                        <span className="ml-2">
                                          Amount: {String(log.details.amount)}
                                        </span>
                                      )}
                                    </span>
                                  )}
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
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </>
  );
}
