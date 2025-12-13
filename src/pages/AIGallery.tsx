import { useState, useEffect } from "react";
import { Download, X, Calendar, Sparkles, ArrowLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}

const STYLE_CATEGORIES = [
  "All",
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
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.style === activeFilter));
    }
  }, [activeFilter, images]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
      setFilteredImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
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

  // Get counts for each style
  const getStyleCount = (style: string) => {
    if (style === "All") return images.length;
    return images.filter((img) => img.style === style).length;
  };

  return (
    <>
      <Helmet>
        <title>AI Gallery | Interior of AI - Generated Interior Designs</title>
        <meta
          name="description"
          content="Browse stunning AI-generated interior designs created by our community. Filter by style and download high-quality room concepts."
        />
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
            <div className="w-24" />
          </div>
        </header>

        {/* Hero */}
        <section className="py-12 px-6">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">AI-Generated</span> Interior Designs
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore stunning interior design concepts created by our community. 
              Filter by style to find your inspiration.
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
                if (style !== "All" && count === 0) return null;
                
                return (
                  <button
                    key={style}
                    onClick={() => setActiveFilter(style)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      activeFilter === style
                        ? "bg-gradient-gold text-primary-foreground shadow-gold"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {style}
                    <span className={cn(
                      "ml-1.5 text-xs",
                      activeFilter === style ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      ({count})
                    </span>
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
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                {activeFilter === "All" ? (
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
                    <Button variant="gold-outline" onClick={() => setActiveFilter("All")}>
                      View All Designs
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-secondary cursor-pointer hover-lift"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Style Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur text-foreground">
                        {image.style}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm text-foreground line-clamp-2 mb-2">{image.prompt}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(image.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
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
                    src={selectedImage.image_url}
                    alt={selectedImage.prompt}
                    className="w-full h-auto max-h-[70vh] object-contain bg-secondary"
                  />
                </div>
                <div className="lg:w-1/3 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        {selectedImage.style}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      Design Details
                    </h3>
                    <p className="text-muted-foreground mb-4">{selectedImage.prompt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedImage.created_at)}
                    </div>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full mt-6"
                    onClick={() => downloadImage(selectedImage.image_url, selectedImage.prompt)}
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
