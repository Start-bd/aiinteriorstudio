import { useState } from "react";
import { Folder, MoreVertical, Pencil, Trash2, Images, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/hooks/useCollections";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { format } from "date-fns";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}

interface CollectionsSectionProps {
  collections: Collection[];
  loading: boolean;
  onCreateCollection: (name: string, description?: string) => Promise<any>;
  onUpdateCollection: (id: string, name: string, description?: string) => Promise<void>;
  onDeleteCollection: (id: string) => Promise<void>;
  getCollectionImages: (id: string) => Promise<GeneratedImage[]>;
  onRemoveFromCollection: (collectionId: string, imageId: string) => Promise<void>;
  onImageClick: (image: GeneratedImage) => void;
}

export const CollectionsSection = ({
  collections,
  loading,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  getCollectionImages,
  onRemoveFromCollection,
  onImageClick,
}: CollectionsSectionProps) => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionImages, setCollectionImages] = useState<GeneratedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleCollectionClick = async (collection: Collection) => {
    setSelectedCollection(collection);
    setLoadingImages(true);
    const images = await getCollectionImages(collection.id);
    setCollectionImages(images);
    setLoadingImages(false);
  };

  const handleBack = () => {
    setSelectedCollection(null);
    setCollectionImages([]);
  };

  const handleDeleteClick = (collection: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (collection: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollectionToEdit(collection);
    setEditName(collection.name);
    setEditDescription(collection.description || "");
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!collectionToEdit || !editName.trim()) return;
    await onUpdateCollection(collectionToEdit.id, editName.trim(), editDescription.trim() || undefined);
    setEditDialogOpen(false);
    setCollectionToEdit(null);
  };

  const handleRemoveImage = async (imageId: string) => {
    if (!selectedCollection) return;
    await onRemoveFromCollection(selectedCollection.id, imageId);
    setCollectionImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Collection detail view
  if (selectedCollection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="text-xl font-display font-bold">{selectedCollection.name}</h3>
            {selectedCollection.description && (
              <p className="text-sm text-muted-foreground">{selectedCollection.description}</p>
            )}
          </div>
        </div>

        {loadingImages ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : collectionImages.length === 0 ? (
          <Card className="glass-card border-border p-12 text-center">
            <Images className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-display font-semibold mb-2">No images yet</h4>
            <p className="text-muted-foreground">
              Add images to this collection from your generation history.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {collectionImages.map((image) => (
              <Card
                key={image.id}
                className="glass-card border-border overflow-hidden hover-lift group cursor-pointer"
                onClick={() => onImageClick(image)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
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
    );
  }

  // Collections list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          Collections
        </h3>
        <CreateCollectionDialog onCreateCollection={onCreateCollection} />
      </div>

      {collections.length === 0 ? (
        <Card className="glass-card border-border p-12 text-center">
          <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-display font-semibold mb-2">No collections yet</h4>
          <p className="text-muted-foreground mb-4">
            Create collections to organize your generated images.
          </p>
          <CreateCollectionDialog
            onCreateCollection={onCreateCollection}
            trigger={<Button>Create Your First Collection</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="glass-card border-border overflow-hidden hover-lift group cursor-pointer"
              onClick={() => handleCollectionClick(collection)}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-secondary/30">
                {collection.cover_image ? (
                  <img
                    src={collection.cover_image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Folder className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEditClick(collection, e as any)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => handleDeleteClick(collection, e as any)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-display font-semibold text-foreground truncate">
                  {collection.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {collection.image_count || 0} image{collection.image_count !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{collectionToDelete?.name}"? The images in this
              collection will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (collectionToDelete) {
                  onDeleteCollection(collectionToDelete.id);
                }
                setDeleteDialogOpen(false);
                setCollectionToDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={!editName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
