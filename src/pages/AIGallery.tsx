import { useState, useEffect, useCallback } from "react";
import { Download, X, Calendar, Sparkles, ArrowLeft, Filter, Heart, LogIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

interface GeneratedImage {
  id: string;
  prompt: string | null;
  image_url: string | null;
  style: string | null;
  created_at: string | null;
}

const ITEMS_PER_PAGE = 24;

const STYLE_CATEGORIES = [
  "All",
  "Favorites",
  "Modern",
  "Scandinavian",
  "Industrial",
  "Minimalist",
  "Bohemian",
  "Mid-Century",
  "Traditional",
  "Rustic",
  "Luxury",
  "Japanese",
  "Other",
];

const AIGallery = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites();
  const { toast } = useToast();

  const fetchImages = useCallback(async (page: number, filter: string) => {
    setIsLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("generated_images_public")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (filter !== "All" && filter !== "Favorites") {
        query = query.eq("style", filter);
      }

      // Favorites filter needs client-side handling since favoriteIds are local
      if (filter === "Favorites") {
        const favArray = Array.from(favoriteIds);
        if (favArray.length === 0) {
          setImages([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }
        query = query.in("id", favArray);
      }

      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;
      setImages((data as GeneratedImage[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [favoriteIds]);

  useEffect(() => {
    fetchImages(currentPage, activeFilter);
  }, [currentPage, activeFilter, fetchImages]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Keyboard navigation for lightbox
  const selectedIndex = selectedImage ? images.findIndex(img => img.id === selectedImage.id) : -1;

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (selectedIndex === -1) return;
    const newIndex = direction === 'prev' 
      ? (selectedIndex - 1 + images.length) % images.length
      : (selectedIndex + 1) % images.length;
    setSelectedImage(images[newIndex]);
  }, [selectedIndex, images]);

  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
      else if (e.key === 'ArrowLeft') navigateLightbox('prev');
      else if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateLightbox]);

  // Pagination
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleToggleFavorite = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        action: (
          <Link to="/auth">
            <Button variant="gold" size="sm">Sign In</Button>
          </Link>
        ),
      });
      return;
    }
    
    const wasFavorite = isFavorite(imageId);
    const success = await toggleFavorite(imageId);
    if (success) {
      toast({
        title: wasFavorite ? "Removed from favorites" : "Added to favorites",
        description: wasFavorite 
          ? "Design removed from your collection" 
          : "Design saved to your collection",
      });
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interior-ai-${prompt.slice(0, 30).replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStyleCount = (style: string) => {
    if (style === activeFilter) return totalCount;
    if (style === "Favorites") return favoriteIds.size;
    return null; // Don't show count for inactive filters with server-side pagination
  };

  return (
    <>
      <Helmet>
        <title>AI Gallery | Interior of AI - Generated Interior Designs</title>
        <meta
          name="description"
          content="Browse stunning AI-generated interior designs created by our community. Filter by style, save favorites, and download high-quality room concepts."
        />
        <link rel="canonical" href="https://interiorofai.com/gallery" />
        <meta property="og:title" content="AI Interior Design Gallery" />
        <meta property="og:description" content="Browse AI-generated room designs by style and room type, save favorites, and download high-quality concepts." />
        <meta property="og:url" content="https://interiorofai.com/gallery" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "AI Interior Design Gallery",
          "description": "Browse stunning AI-generated interior designs created by our community.",
          "url": "https://interiorofai.com/gallery",
          "publisher": {
            "@type": "Organization",
            "name": "Interior of AI"
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-body text-sm">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-semibold text-foreground">AI Gallery</span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <span className="text-sm text-muted-foreground">
                  Welcome back!
                </span>
              ) : (
                <Link to="/auth">
                  <Button variant="gold-outline" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-12 px-6">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">AI-Generated</span> Interior Designs
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore stunning interior design concepts. 
              {user ? " Save your favorites to your personal collection." : " Sign in to save favorites."}
            </p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="px-6 pb-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by style:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STYLE_CATEGORIES.map((style) => {
                const count = getStyleCount(style);
                // Hide Favorites tab if not logged in
                if (style === "Favorites" && !user) return null;
                
                
                return (
                  <button
                    key={style}
                    onClick={() => handleFilterChange(style)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5",
                      activeFilter === style
                        ? "bg-gradient-gold text-primary-foreground shadow-gold"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {style === "Favorites" && <Heart className="w-3.5 h-3.5" />}
                    {style}
                    {count !== null && (
                      <span className={cn(
                        "text-xs",
                        activeFilter === style ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-20 px-6">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                  {activeFilter === "Favorites" ? (
                    <Heart className="w-10 h-10 text-primary" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-primary" />
                  )}
                </div>
                {activeFilter === "Favorites" ? (
                  <>
                    <h2 className="font-display text-2xl text-foreground mb-2">No favorites yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Click the heart icon on any design to save it here.
                    </p>
                    <Button variant="gold-outline" onClick={() => handleFilterChange("All")}>
                      Browse All Designs
                    </Button>
                  </>
                ) : activeFilter === "All" ? (
                  <>
                    <h2 className="font-display text-2xl text-foreground mb-2">No images yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Be the first to generate an AI interior design!
                    </p>
                    <Link to="/">
                      <Button variant="gold">Open AI Assistant</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-2xl text-foreground mb-2">No {activeFilter} designs yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Try generating a {activeFilter.toLowerCase()} interior design!
                    </p>
                    <Button variant="gold-outline" onClick={() => handleFilterChange("All")}>
                      View All Designs
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-secondary cursor-pointer hover-lift"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.image_url || ''}
                        alt={image.prompt || `${image.style ?? 'AI'} style interior room design generated with AI`}
                        width={400}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur text-foreground">
                          {image.style}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(e, image.id)}
                        className={cn(
                          "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                          isFavorite(image.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-background/80 backdrop-blur text-foreground opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", isFavorite(image.id) && "fill-current")} />
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-sm text-foreground line-clamp-2 mb-2">{image.prompt}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(image.created_at || '')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                  className="absolute left-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                  className="absolute right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div
              className="relative max-w-5xl w-full bg-card rounded-2xl overflow-hidden shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3">
                  <img
                    src={selectedImage.image_url || ''}
                    alt={selectedImage.prompt || `${selectedImage.style ?? 'AI'} style interior room design generated with AI, shown full size`}
                    className="w-full h-auto max-h-[70vh] object-contain bg-secondary"
                  />
                </div>
                <div className="lg:w-1/3 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        {selectedImage.style}
                      </span>
                      <button
                        onClick={(e) => handleToggleFavorite(e, selectedImage.id)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          isFavorite(selectedImage.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", isFavorite(selectedImage.id) && "fill-current")} />
                      </button>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      Design Details
                    </h3>
                    <p className="text-muted-foreground mb-4">{selectedImage.prompt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedImage.created_at || '')}
                    </div>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full mt-6"
                    onClick={() => downloadImage(selectedImage.image_url || '', selectedImage.prompt || '')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AIGallery;
