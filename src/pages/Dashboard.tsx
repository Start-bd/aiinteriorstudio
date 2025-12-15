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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Sparkles, Clock, TrendingUp, Calendar, ChevronLeft, ChevronRight, Download, Share2, Trash2, Filter, X, CheckSquare, Square, FolderPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format, subDays, startOfDay, endOfDay, subMonths } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageDetailModal } from "@/components/ImageDetailModal";
import { useCollections } from "@/hooks/useCollections";
import { CollectionsSection } from "@/components/CollectionsSection";
import { AddToCollectionDialog } from "@/components/AddToCollectionDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
];

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GeneratedImage | null>(null);
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [detailImage, setDetailImage] = useState<GeneratedImage | null>(null);
  const [addToCollectionImage, setAddToCollectionImage] = useState<GeneratedImage | null>(null);

  const {
    collections,
    loading: collectionsLoading,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionSharing,
    addImageToCollection,
    removeImageFromCollection,
    getCollectionImages,
    updateImagePositions,
    getImageCollections,
  } = useCollections(user?.id);

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
  }, [user, currentPage, styleFilter, dateFilter]);

  const getDateRange = (filter: string) => {
    const now = new Date();
    switch (filter) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "week":
        return { start: subDays(now, 7), end: now };
      case "month":
        return { start: subDays(now, 30), end: now };
      case "3months":
        return { start: subMonths(now, 3), end: now };
      default:
        return null;
    }
  };

  const fetchUserImages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("generated_images")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if (styleFilter !== "all") {
        query = query.eq("style", styleFilter);
      }

      const dateRange = getDateRange(dateFilter);
      if (dateRange) {
        query = query.gte("created_at", dateRange.start.toISOString())
                     .lte("created_at", dateRange.end.toISOString());
      }

      const { data: imagesData, error: imagesError, count } = await query
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

      setAvailableStyles(Object.keys(styleCounts).sort());

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

  const handleDelete = async () => {
    if (!imageToDelete || !user) return;

    try {
      const { error } = await supabase
        .from("generated_images")
        .delete()
        .eq("id", imageToDelete.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Image deleted successfully");
      setDeleteDialogOpen(false);
      setImageToDelete(null);
      fetchUserImages();
      fetchUserStats();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const clearFilters = () => {
    setStyleFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = styleFilter !== "all" || dateFilter !== "all";

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0 || !user) return;

    try {
      const { error } = await supabase
        .from("generated_images")
        .delete()
        .in("id", Array.from(selectedImages))
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success(`${selectedImages.size} image(s) deleted successfully`);
      setBulkDeleteDialogOpen(false);
      setSelectedImages(new Set());
      setIsSelectionMode(false);
      fetchUserImages();
      fetchUserStats();
    } catch (error) {
      console.error("Error deleting images:", error);
      toast.error("Failed to delete images");
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedImages(new Set());
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interior-design-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const handleShare = async (imageUrl: string, prompt: string) => {
    const shareData = {
      title: "AI Interior Design",
      text: prompt,
      url: imageUrl,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(imageUrl);
        toast.success("Image URL copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy URL");
      }
    }
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

          {/* Tabs for History and Collections */}
          <Tabs defaultValue="history" className="space-y-6">
            <TabsList>
              <TabsTrigger value="history" className="gap-2">
                <Calendar className="h-4 w-4" />
                Generation History
              </TabsTrigger>
              <TabsTrigger value="collections" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Collections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collections">
              <CollectionsSection
                collections={collections}
                loading={collectionsLoading}
                onCreateCollection={createCollection}
                onUpdateCollection={updateCollection}
                onDeleteCollection={deleteCollection}
                onToggleSharing={toggleCollectionSharing}
                getCollectionImages={getCollectionImages}
                onUpdateImagePositions={updateImagePositions}
                onRemoveFromCollection={removeImageFromCollection}
                onImageClick={setDetailImage}
              />
            </TabsContent>

            <TabsContent value="history">
          {/* Generation History */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Generation History
              </h2>
              
              <div className="flex flex-wrap items-center gap-3">
                {!isSelectionMode ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={styleFilter} onValueChange={(value) => { setStyleFilter(value); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Styles</SelectItem>
                          {availableStyles.map((style) => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={dateFilter} onValueChange={(value) => { setDateFilter(value); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          {DATE_RANGE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {images.length > 0 && (
                      <Button variant="outline" size="sm" onClick={() => setIsSelectionMode(true)} className="h-9 gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Select
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={toggleSelectAll} className="h-9 gap-2">
                      {selectedImages.size === images.length ? (
                        <>
                          <CheckSquare className="w-4 h-4" />
                          Deselect All
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4" />
                          Select All ({images.length})
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setBulkDeleteDialogOpen(true)}
                      disabled={selectedImages.size === 0}
                      className="h-9 gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedImages.size})
                    </Button>
                    
                    <Button variant="ghost" size="sm" onClick={exitSelectionMode} className="h-9">
                      Cancel
                    </Button>
                  </div>
                )}
                
                {totalCount > 0 && !isSelectionMode && (
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
                  </p>
                )}
              </div>
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
                      className={`glass-card border-border overflow-hidden hover-lift group cursor-pointer ${
                        selectedImages.has(image.id) ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={isSelectionMode ? () => toggleImageSelection(image.id) : () => setDetailImage(image)}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={image.prompt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {isSelectionMode && (
                          <div className="absolute top-3 left-3 z-10">
                            <Checkbox
                              checked={selectedImages.has(image.id)}
                              onCheckedChange={() => toggleImageSelection(image.id)}
                              className="h-5 w-5 bg-background/80 border-2"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                        {!isSelectionMode && (
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3 gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddToCollectionImage(image);
                              }}
                            >
                              <FolderPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(image.image_url, image.prompt);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(image.image_url, image.prompt);
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageToDelete(image);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedImages.size} Image(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedImages.size} selected image(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImageDetailModal
        image={detailImage}
        open={!!detailImage}
        onOpenChange={(open) => !open && setDetailImage(null)}
        collections={collections}
        onAddToCollection={() => {
          if (detailImage) {
            setAddToCollectionImage(detailImage);
          }
        }}
      />

      <AddToCollectionDialog
        open={!!addToCollectionImage}
        onOpenChange={(open) => !open && setAddToCollectionImage(null)}
        collections={collections}
        imageId={addToCollectionImage?.id || ""}
        getImageCollections={getImageCollections}
        onAddToCollection={addImageToCollection}
        onRemoveFromCollection={removeImageFromCollection}
        onCreateCollection={createCollection}
      />
    </>
  );
};

export default Dashboard;
