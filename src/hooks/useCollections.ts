import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  image_count?: number;
  cover_image?: string;
}

export const useCollections = (userId: string | undefined) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (collectionsError) throw collectionsError;

      // Fetch image counts and cover images for each collection
      const collectionsWithDetails = await Promise.all(
        (collectionsData || []).map(async (collection) => {
          const { data: imageLinks, error: linksError } = await supabase
            .from("collection_images")
            .select("image_id")
            .eq("collection_id", collection.id);

          if (linksError) {
            console.error("Error fetching image links:", linksError);
            return { ...collection, image_count: 0, cover_image: undefined };
          }

          let coverImage: string | undefined;
          if (imageLinks && imageLinks.length > 0) {
            const { data: coverData } = await supabase
              .from("generated_images")
              .select("image_url")
              .eq("id", imageLinks[0].image_id)
              .single();
            coverImage = coverData?.image_url;
          }

          return {
            ...collection,
            image_count: imageLinks?.length || 0,
            cover_image: coverImage,
          };
        })
      );

      setCollections(collectionsWithDetails);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = async (name: string, description?: string) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("collections")
        .insert({ user_id: userId, name, description: description || null })
        .select()
        .single();

      if (error) throw error;

      toast.success("Collection created!");
      fetchCollections();
      return data;
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
      return null;
    }
  };

  const updateCollection = async (
    collectionId: string,
    name: string,
    description?: string
  ) => {
    try {
      const { error } = await supabase
        .from("collections")
        .update({ name, description: description || null })
        .eq("id", collectionId);

      if (error) throw error;

      toast.success("Collection updated!");
      fetchCollections();
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.error("Failed to update collection");
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId);

      if (error) throw error;

      toast.success("Collection deleted!");
      fetchCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection");
    }
  };

  const addImageToCollection = async (
    collectionId: string,
    imageId: string
  ) => {
    try {
      const { error } = await supabase
        .from("collection_images")
        .insert({ collection_id: collectionId, image_id: imageId });

      if (error) {
        if (error.code === "23505") {
          toast.info("Image already in this collection");
          return;
        }
        throw error;
      }

      toast.success("Image added to collection!");
      fetchCollections();
    } catch (error) {
      console.error("Error adding image to collection:", error);
      toast.error("Failed to add image to collection");
    }
  };

  const removeImageFromCollection = async (
    collectionId: string,
    imageId: string
  ) => {
    try {
      const { error } = await supabase
        .from("collection_images")
        .delete()
        .eq("collection_id", collectionId)
        .eq("image_id", imageId);

      if (error) throw error;

      toast.success("Image removed from collection!");
      fetchCollections();
    } catch (error) {
      console.error("Error removing image from collection:", error);
      toast.error("Failed to remove image from collection");
    }
  };

  const getCollectionImages = async (collectionId: string) => {
    try {
      const { data: links, error: linksError } = await supabase
        .from("collection_images")
        .select("image_id")
        .eq("collection_id", collectionId);

      if (linksError) throw linksError;

      if (!links || links.length === 0) return [];

      const imageIds = links.map((l) => l.image_id);
      const { data: images, error: imagesError } = await supabase
        .from("generated_images")
        .select("*")
        .in("id", imageIds)
        .order("created_at", { ascending: false });

      if (imagesError) throw imagesError;

      return images || [];
    } catch (error) {
      console.error("Error fetching collection images:", error);
      toast.error("Failed to load collection images");
      return [];
    }
  };

  const getImageCollections = async (imageId: string) => {
    try {
      const { data, error } = await supabase
        .from("collection_images")
        .select("collection_id")
        .eq("image_id", imageId);

      if (error) throw error;

      return data?.map((d) => d.collection_id) || [];
    } catch (error) {
      console.error("Error fetching image collections:", error);
      return [];
    }
  };

  return {
    collections,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    addImageToCollection,
    removeImageFromCollection,
    getCollectionImages,
    getImageCollections,
    refreshCollections: fetchCollections,
  };
};
