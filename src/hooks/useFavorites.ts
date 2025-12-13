import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("image_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavoriteIds(new Set(data?.map((f) => f.image_id) || []));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (imageId: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    const isFavorited = favoriteIds.has(imageId);

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("image_id", imageId);

        if (error) throw error;
        
        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, image_id: imageId });

        if (error) throw error;
        
        setFavoriteIds((prev) => new Set([...prev, imageId]));
      }
      
      return true;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (imageId: string) => favoriteIds.has(imageId);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    isLoading,
    refetch: fetchFavorites,
  };
}
