import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ImageIcon, Sparkles, Clock, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}

interface UsageStats {
  totalImages: number;
  imagesThisWeek: number;
  imagesToday: number;
  favoriteStyle: string;
  styleCounts: Record<string, number>;
}

const ITEMS_PER_PAGE = 12;

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserImages();
    }
  }, [user, currentPage]);

  const fetchUserImages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data: imagesData, error: imagesError, count } = await supabase
        .from("generated_images")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (imagesError) throw imagesError;

      setImages(imagesData || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch all user images for stats calculation
      const { data: allImages, error } = await supabase
        .from("generated_images")
        .select("created_at, style")
        .eq("user_id", user.id);

      if (error) throw error;

      const userImages = allImages || [];

      const now = new Date();
      const weekAgo = subDays(now, 7);
      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);

      const imagesThisWeek = userImages.filter(
        (img) => new Date(img.created_at) >= weekAgo
      ).length;

      const imagesToday = userImages.filter((img) => {
        const imgDate = new Date(img.created_at);
        return imgDate >= todayStart && imgDate <= todayEnd;
      }).length;

      const styleCounts: Record<string, number> = {};
      userImages.forEach((img) => {
        styleCounts[img.style] = (styleCounts[img.style] || 0) + 1;
      });

      const favoriteStyle =
        Object.entries(styleCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        "None yet";

      setStats({
        totalImages: userImages.length,
        imagesThisWeek,
        imagesToday,
        favoriteStyle,
        styleCounts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Interior of AI</title>
        <meta
          name="description"
          content="View your AI interior design generation history and usage statistics."
        />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Your <span className="text-gradient-gold">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Track your AI design generations and usage
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="glass-card border-border">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card className="glass-card border-border hover-lift">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      Total Generations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {stats?.totalImages || 0}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border hover-lift">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {stats?.imagesThisWeek || 0}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border hover-lift">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {stats?.imagesToday || 0}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border hover-lift">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Favorite Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-display font-bold text-foreground truncate">
                      {stats?.favoriteStyle || "None yet"}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Style Breakdown */}
          {stats && Object.keys(stats.styleCounts).length > 0 && (
            <Card className="glass-card border-border mb-10">
              <CardHeader>
                <CardTitle className="text-lg font-display">
                  Style Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Object.entries(stats.styleCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([style, count]) => (
                      <div
                        key={style}
                        className="bg-secondary/50 rounded-lg p-3 text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-1">
                          {style}
                        </p>
                        <p className="text-xl font-display font-bold text-foreground">
                          {count}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation History */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Generation History
              </h2>
              {totalCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <Card key={i} className="glass-card border-border overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : images.length === 0 ? (
              <Card className="glass-card border-border p-12 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold mb-2">
                  No generations yet
                </h3>
                <p className="text-muted-foreground">
                  Start creating AI interior designs using the chat assistant!
                </p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <Card
                      key={image.id}
                      className="glass-card border-border overflow-hidden hover-lift group"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={image.prompt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-foreground line-clamp-2 mb-2">
                          {image.prompt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {image.style}
                          </span>
                          <span>
                            {format(new Date(image.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-9 h-9 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
