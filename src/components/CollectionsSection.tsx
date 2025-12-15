import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Folder, MoreVertical, Pencil, Trash2, Images, ChevronLeft, Share2, Link, GripVertical, Globe, Lock, ImageIcon, Download, FileText, FileArchive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection, CollectionImage } from "@/hooks/useCollections";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { exportCollectionAsZip, exportCollectionAsPdf } from "@/lib/exportCollection";
import { format } from "date-fns";
import { toast } from "sonner";

interface CollectionsSectionProps {
  collections: Collection[];
  loading: boolean;
  onCreateCollection: (name: string, description?: string) => Promise<any>;
  onUpdateCollection: (id: string, name: string, description?: string) => Promise<void>;
  onDeleteCollection: (id: string) => Promise<void>;
  onToggleSharing: (id: string, isPublic: boolean) => Promise<void>;
  onSetCoverImage: (collectionId: string, imageId: string | null) => Promise<void>;
  getCollectionImages: (id: string) => Promise<CollectionImage[]>;
  onUpdateImagePositions: (collectionId: string, positions: { imageId: string; position: number }[]) => Promise<void>;
  onRemoveFromCollection: (collectionId: string, imageId: string) => Promise<void>;
  onImageClick: (image: CollectionImage) => void;
}

export const CollectionsSection = ({
  collections,
  loading,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onToggleSharing,
  onSetCoverImage,
  getCollectionImages,
  onUpdateImagePositions,
  onRemoveFromCollection,
  onImageClick,
}: CollectionsSectionProps) => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionImages, setCollectionImages] = useState<CollectionImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [collectionToShare, setCollectionToShare] = useState<Collection | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

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
    setIsReorderMode(false);
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

  const handleShareClick = (collection: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollectionToShare(collection);
    setShareDialogOpen(true);
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

  const handleToggleSharing = async (isPublic: boolean) => {
    if (!collectionToShare) return;
    await onToggleSharing(collectionToShare.id, isPublic);
    // Update the local collection state
    setCollectionToShare((prev) => (prev ? { ...prev, is_public: isPublic } : null));
    // Find and update collection in list
    const updatedCollection = collections.find((c) => c.id === collectionToShare.id);
    if (updatedCollection && selectedCollection?.id === collectionToShare.id) {
      setSelectedCollection({ ...selectedCollection, is_public: isPublic });
    }
  };

  const handleCopyLink = async () => {
    if (!collectionToShare?.share_token) return;
    const shareUrl = `${window.location.origin}/collection/${collectionToShare.share_token}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleExport = async (format: "zip" | "pdf") => {
    if (!selectedCollection || collectionImages.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      if (format === "zip") {
        await exportCollectionAsZip(selectedCollection, collectionImages, setExportProgress);
      } else {
        await exportCollectionAsPdf(selectedCollection, collectionImages, setExportProgress);
      }
    } finally {
      setIsExporting(false);
      setExportDialogOpen(false);
      setExportProgress(0);
    }
  };

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination || !selectedCollection) return;

      const items = Array.from(collectionImages);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Update local state immediately
      setCollectionImages(items);

      // Update positions in database
      const positions = items.map((item, index) => ({
        imageId: item.id,
        position: index,
      }));

      await onUpdateImagePositions(selectedCollection.id, positions);
    },
    [collectionImages, selectedCollection, onUpdateImagePositions]
  );

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-bold">{selectedCollection.name}</h3>
                {selectedCollection.is_public && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    <Globe className="h-3 w-3" />
                    Public
                  </span>
                )}
              </div>
              {selectedCollection.description && (
                <p className="text-sm text-muted-foreground">{selectedCollection.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {collectionImages.length > 1 && (
              <Button
                variant={isReorderMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsReorderMode(!isReorderMode)}
                className="gap-2"
              >
                <GripVertical className="h-4 w-4" />
                {isReorderMode ? "Done" : "Reorder"}
              </Button>
            )}
            {collectionImages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportDialogOpen(true)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleShareClick(selectedCollection, e as any)}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
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
        ) : isReorderMode ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {collectionImages.map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${snapshot.isDragging ? "z-50" : ""}`}
                        >
                          <Card
                            className={`glass-card border-border overflow-hidden group cursor-grab active:cursor-grabbing ${
                              snapshot.isDragging ? "ring-2 ring-primary shadow-lg" : ""
                            }`}
                          >
                            <div className="aspect-square relative overflow-hidden">
                              <img
                                src={image.image_url}
                                alt={image.prompt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                <GripVertical className="h-8 w-8 text-foreground" />
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <p className="text-sm text-foreground line-clamp-1">{image.prompt}</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {collectionImages.map((image) => {
              const isCover = selectedCollection?.cover_image_id === image.id;
              return (
                <Card
                  key={image.id}
                  className={`glass-card border-border overflow-hidden hover-lift group cursor-pointer ${
                    isCover ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => onImageClick(image)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isCover && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          <ImageIcon className="h-3 w-3" />
                          Cover
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedCollection) {
                            onSetCoverImage(selectedCollection.id, isCover ? null : image.id);
                            setSelectedCollection({
                              ...selectedCollection,
                              cover_image_id: isCover ? null : image.id,
                            });
                          }
                        }}
                      >
                        {isCover ? "Remove Cover" : "Set as Cover"}
                      </Button>
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
              );
            })}
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
                {collection.is_public && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                      <Globe className="h-3 w-3" />
                      Public
                    </span>
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
                      <DropdownMenuItem onClick={(e) => handleShareClick(collection, e as any)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleEditClick(collection, e as any)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
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

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Collection</DialogTitle>
            <DialogDescription>
              Make this collection public to share it with anyone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {collectionToShare?.is_public ? (
                  <Globe className="h-5 w-5 text-primary" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Public Access</p>
                  <p className="text-sm text-muted-foreground">
                    {collectionToShare?.is_public
                      ? "Anyone with the link can view"
                      : "Only you can view this collection"}
                  </p>
                </div>
              </div>
              <Switch
                checked={collectionToShare?.is_public ?? false}
                onCheckedChange={handleToggleSharing}
              />
            </div>

            {collectionToShare?.is_public && collectionToShare?.share_token && (
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/collection/${collectionToShare.share_token}`}
                    className="flex-1"
                  />
                  <Button onClick={handleCopyLink} className="gap-2">
                    <Link className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={(open) => !isExporting && setExportDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Collection</DialogTitle>
            <DialogDescription>
              Download this collection as a ZIP archive or PDF document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isExporting ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Exporting collection... Please wait.
                </p>
                <Progress value={exportProgress} className="w-full" />
                <p className="text-xs text-muted-foreground text-center">
                  {exportProgress}% complete
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleExport("zip")}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <FileArchive className="h-10 w-10 text-primary" />
                  <div className="text-center">
                    <p className="font-medium">ZIP Archive</p>
                    <p className="text-xs text-muted-foreground">
                      Images + metadata files
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="text-center">
                    <p className="font-medium">PDF Gallery</p>
                    <p className="text-xs text-muted-foreground">
                      Printable document
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
