import { useState, useEffect } from "react";
import { FolderPlus, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collection } from "@/hooks/useCollections";
import { CreateCollectionDialog } from "./CreateCollectionDialog";

interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collections: Collection[];
  imageId: string;
  getImageCollections: (imageId: string) => Promise<string[]>;
  onAddToCollection: (collectionId: string, imageId: string) => Promise<void>;
  onRemoveFromCollection: (collectionId: string, imageId: string) => Promise<void>;
  onCreateCollection: (name: string, description?: string) => Promise<any>;
}

export const AddToCollectionDialog = ({
  open,
  onOpenChange,
  collections,
  imageId,
  getImageCollections,
  onAddToCollection,
  onRemoveFromCollection,
  onCreateCollection,
}: AddToCollectionDialogProps) => {
  const [imageCollectionIds, setImageCollectionIds] = useState<string[]>([]);
  const [loadingCollections, setLoadingCollections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open && imageId) {
      getImageCollections(imageId).then(setImageCollectionIds);
    }
  }, [open, imageId, getImageCollections]);

  const handleToggleCollection = async (collectionId: string) => {
    setLoadingCollections((prev) => new Set([...prev, collectionId]));

    const isInCollection = imageCollectionIds.includes(collectionId);

    if (isInCollection) {
      await onRemoveFromCollection(collectionId, imageId);
      setImageCollectionIds((prev) => prev.filter((id) => id !== collectionId));
    } else {
      await onAddToCollection(collectionId, imageId);
      setImageCollectionIds((prev) => [...prev, collectionId]);
    }

    setLoadingCollections((prev) => {
      const newSet = new Set(prev);
      newSet.delete(collectionId);
      return newSet;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Select collections to add this image to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {collections.length === 0 ? (
            <div className="text-center py-8">
              <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                No collections yet. Create one to get started.
              </p>
              <CreateCollectionDialog
                onCreateCollection={onCreateCollection}
                trigger={
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Collection
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {collections.map((collection) => {
                    const isInCollection = imageCollectionIds.includes(collection.id);
                    const isLoading = loadingCollections.has(collection.id);

                    return (
                      <button
                        key={collection.id}
                        onClick={() => handleToggleCollection(collection.id)}
                        disabled={isLoading}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isInCollection
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                        } ${isLoading ? "opacity-50" : ""}`}
                      >
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
                            isInCollection
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {isInCollection ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <FolderPlus className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">
                            {collection.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {collection.image_count || 0} image
                            {collection.image_count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="border-t pt-4">
                <CreateCollectionDialog
                  onCreateCollection={onCreateCollection}
                  trigger={
                    <Button variant="outline" className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Collection
                    </Button>
                  }
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
