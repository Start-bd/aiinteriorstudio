import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ImageDetailModal } from "@/components/ImageDetailModal";
import { Folder, Images, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
}

interface CollectionImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}

const SharedCollection = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [images, setImages] = useState<CollectionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailImage, setDetailImage] = useState<CollectionImage | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!shareToken) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        // Fetch collection
        const { data: collectionData, error: collectionError } = await supabase
          .from("collections")
          .select("*")
          .eq("share_token", shareToken)
          .eq("is_public", true)
          .single();

        if (collectionError || !collectionData) {
          setError("Collection not found or is private");
          setLoading(false);
          return;
        }

        setCollection(collectionData);

        // Fetch images
        const { data: links, error: linksError } = await supabase
          .from("collection_images")
          .select("image_id, position")
          .eq("collection_id", collectionData.id)
          .order("position", { ascending: true });

        if (linksError) throw linksError;

        if (links && links.length > 0) {
          const imageIds = links.map((l) => l.image_id);
          const { data: imagesData, error: imagesError } = await supabase
            .from("generated_images")
            .select("*")
            .in("id", imageIds);

          if (imagesError) throw imagesError;

          // Sort by position
          const sortedImages = (imagesData || []).sort((a, b) => {
            const posA = links.find((l) => l.image_id === a.id)?.position ?? 0;
            const posB = links.find((l) => l.image_id === b.id)?.position ?? 0;
            return posA - posB;
          });

          setImages(sortedImages);
        }
      } catch (err) {
        console.error("Error fetching collection:", err);
        setError("Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [shareToken]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="container mx-auto px-6">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !collection) {
    return (
      <>
        <Helmet>
          <title>Collection Not Found | Interior of AI</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="container mx-auto px-6">
            <Card className="glass-card border-border p-12 text-center max-w-md mx-auto">
              <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold mb-2">Collection Not Found</h1>
              <p className="text-muted-foreground mb-6">
                {error || "This collection doesn't exist or is no longer public."}
              </p>
              <Link to="/gallery">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Gallery
                </Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{collection.name} | Interior of AI</title>
        <meta
          name="description"
          content={collection.description || `View ${collection.name} - a curated collection of AI-generated interior designs.`}
        />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-muted-foreground text-lg max-w-2xl">
                {collection.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {images.length} image{images.length !== 1 ? "s" : ""}
            </p>
          </div>

          {images.length === 0 ? (
            <Card className="glass-card border-border p-12 text-center">
              <Images className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold mb-2">No images in this collection</h3>
              <p className="text-muted-foreground">
                This collection is empty.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="glass-card border-border overflow-hidden hover-lift group cursor-pointer"
                  onClick={() => setDetailImage(image)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground line-clamp-2 mb-2">{image.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {image.style}
                      </span>
                      <span>{format(new Date(image.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <ImageDetailModal
        image={detailImage}
        open={!!detailImage}
        onOpenChange={(open) => !open && setDetailImage(null)}
      />
    </>
  );
};

export default SharedCollection;
