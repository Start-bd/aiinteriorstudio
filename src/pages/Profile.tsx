import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import { validateDisplayName } from "@/lib/validation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Heart, Save, Loader2, ImageOff } from "lucide-react";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { favoriteIds } = useFavorites();
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [favoriteImages, setFavoriteImages] = useState<GeneratedImage[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setDisplayName(data?.display_name || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch favorite images
  useEffect(() => {
    const fetchFavoriteImages = async () => {
      if (!user || favoriteIds.size === 0) {
        setFavoriteImages([]);
        setIsLoadingFavorites(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("generated_images")
          .select("*")
          .in("id", Array.from(favoriteIds));

        if (error) throw error;
        setFavoriteImages(data || []);
      } catch (error) {
        console.error("Error fetching favorite images:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavoriteImages();
  }, [user, favoriteIds]);

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validate display name
    const validation = validateDisplayName(displayName);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid display name");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: validation.data })
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Interior of AI</title>
        <meta name="description" content="Manage your profile and view your saved interior design inspirations." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">My Profile</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Profile Settings */}
            <Card className="mb-12 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Update your display name and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProfile ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gold" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                        className="max-w-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={user.email || ""}
                        disabled
                        className="max-w-md bg-muted/50"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <Button
                      variant="gold"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="mt-4"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Designs */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-gold" />
                  Saved Designs
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({favoriteIds.size})
                  </span>
                </CardTitle>
                <CardDescription>
                  Your collection of favorite interior designs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingFavorites ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-gold" />
                  </div>
                ) : favoriteImages.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageOff className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">No saved designs yet</p>
                    <Link to="/gallery">
                      <Button variant="gold-outline">
                        Browse AI Gallery
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteImages.map((image) => (
                      <Link
                        key={image.id}
                        to="/gallery"
                        className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-gold/50 transition-all duration-300"
                      >
                        <img
                          src={image.image_url}
                          alt={image.prompt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">
                              {image.style}
                            </span>
                            <p className="text-white text-sm mt-2 line-clamp-2">
                              {image.prompt}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Heart className="w-5 h-5 text-gold fill-gold" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
