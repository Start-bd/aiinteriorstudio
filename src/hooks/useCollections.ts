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
  is_public: boolean;
  share_token: string | null;
  cover_image_id: string | null;
  image_count?: number;
  cover_image?: string;
}

export interface CollectionImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
  position?: number;
}

export const useCollections = (userId: string | undefined) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data: collectionsData, error: collectionsError } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (collectionsError) throw collectionsError;

      const collectionsWithDetails = await Promise.all(
        (collectionsData || []).map(async (collection) => {
          const { data: imageLinks, error: linksError } = await supabase
            .from("collection_images")
            .select("image_id, position")
            .eq("collection_id", collection.id)
            .order("position", { ascending: true });

          if (linksError) {
            console.error("Error fetching image links:", linksError);
            return { ...collection, image_count: 0, cover_image: undefined };
          }

          let coverImage: string | undefined;
          
          // Use custom cover image if set, otherwise use first image
          if (collection.cover_image_id) {
            const { data: coverData } = await supabase
              .from("generated_images")
              .select("image_url")
              .eq("id", collection.cover_image_id)
              .maybeSingle();
            coverImage = coverData?.image_url;
          }
          
          // Fallback to first image if no custom cover
          if (!coverImage && imageLinks && imageLinks.length > 0) {
            const { data: coverData } = await supabase
              .from("generated_images")
              .select("image_url")
              .eq("id", imageLinks[0].image_id)
              .maybeSingle();
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

  const toggleCollectionSharing = async (collectionId: string, isPublic: boolean) => {
    try {
      const updateData: { is_public: boolean; share_token?: string | null } = {
        is_public: isPublic,
      };

      if (isPublic) {
        // Generate a new share token
        const { data: tokenData } = await supabase.rpc("generate_share_token");
        updateData.share_token = tokenData;
      } else {
        updateData.share_token = null;
      }

      const { error } = await supabase
        .from("collections")
        .update(updateData)
        .eq("id", collectionId);

      if (error) throw error;

      toast.success(isPublic ? "Collection is now public!" : "Collection is now private");
      fetchCollections();
    } catch (error) {
      console.error("Error toggling collection sharing:", error);
      toast.error("Failed to update sharing settings");
    }
  };

  const addImageToCollection = async (
    collectionId: string,
    imageId: string
  ) => {
    try {
      // Get the max position
      const { data: existingLinks } = await supabase
        .from("collection_images")
        .select("position")
        .eq("collection_id", collectionId)
        .order("position", { ascending: false })
        .limit(1);

      const maxPosition = existingLinks?.[0]?.position ?? -1;

      const { error } = await supabase
        .from("collection_images")
        .insert({ 
          collection_id: collectionId, 
          image_id: imageId,
          position: maxPosition + 1 
        });

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

  const getCollectionImages = async (collectionId: string): Promise<CollectionImage[]> => {
    try {
      const { data: links, error: linksError } = await supabase
        .from("collection_images")
        .select("image_id, position")
        .eq("collection_id", collectionId)
        .order("position", { ascending: true });

      if (linksError) throw linksError;

      if (!links || links.length === 0) return [];

      const imageIds = links.map((l) => l.image_id);
      const { data: images, error: imagesError } = await supabase
        .from("generated_images")
        .select("*")
        .in("id", imageIds);

      if (imagesError) throw imagesError;

      // Merge position data and sort by position
      const imagesWithPosition = (images || []).map((img) => {
        const link = links.find((l) => l.image_id === img.id);
        return { ...img, position: link?.position ?? 0 };
      });

      imagesWithPosition.sort((a, b) => a.position - b.position);

      return imagesWithPosition;
    } catch (error) {
      console.error("Error fetching collection images:", error);
      toast.error("Failed to load collection images");
      return [];
    }
  };

  const updateImagePositions = async (
    collectionId: string,
    imagePositions: { imageId: string; position: number }[]
  ) => {
    try {
      // Update each position
      await Promise.all(
        imagePositions.map(({ imageId, position }) =>
          supabase
            .from("collection_images")
            .update({ position })
            .eq("collection_id", collectionId)
            .eq("image_id", imageId)
        )
      );
    } catch (error) {
      console.error("Error updating image positions:", error);
      toast.error("Failed to save image order");
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

  const getPublicCollection = async (shareToken: string) => {
    try {
      const { data: collection, error: collectionError } = await supabase
        .from("collections")
        .select("*")
        .eq("share_token", shareToken)
        .eq("is_public", true)
        .single();

      if (collectionError) throw collectionError;

      return collection;
    } catch (error) {
      console.error("Error fetching public collection:", error);
      return null;
    }
  };

  const getPublicCollectionImages = async (collectionId: string): Promise<CollectionImage[]> => {
    try {
      const { data: links, error: linksError } = await supabase
        .from("collection_images")
        .select("image_id, position")
        .eq("collection_id", collectionId)
        .order("position", { ascending: true });

      if (linksError) throw linksError;

      if (!links || links.length === 0) return [];

      const imageIds = links.map((l) => l.image_id);
      const { data: images, error: imagesError } = await supabase
        .from("generated_images")
        .select("*")
        .in("id", imageIds);

      if (imagesError) throw imagesError;

      const imagesWithPosition = (images || []).map((img) => {
        const link = links.find((l) => l.image_id === img.id);
        return { ...img, position: link?.position ?? 0 };
      });

      imagesWithPosition.sort((a, b) => a.position - b.position);

      return imagesWithPosition;
    } catch (error) {
      console.error("Error fetching public collection images:", error);
      return [];
    }
  };

  const setCoverImage = async (collectionId: string, imageId: string | null) => {
    try {
      const { error } = await supabase
        .from("collections")
        .update({ cover_image_id: imageId })
        .eq("id", collectionId);

      if (error) throw error;

      toast.success(imageId ? "Cover image updated!" : "Cover image removed");
      fetchCollections();
    } catch (error) {
      console.error("Error setting cover image:", error);
      toast.error("Failed to update cover image");
    }
  };

  return {
    collections,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionSharing,
    setCoverImage,
    addImageToCollection,
    removeImageFromCollection,
    getCollectionImages,
    updateImagePositions,
    getImageCollections,
    getPublicCollection,
    getPublicCollectionImages,
    refreshCollections: fetchCollections,
  };
};
