import { format } from "date-fns";
import { Download, Share2, X, Calendar, Palette, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}

interface ImageDetailModalProps {
  image: GeneratedImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageDetailModal = ({
  image,
  open,
  onOpenChange,
}: ImageDetailModalProps) => {
  if (!image) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interior-design-${image.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "AI Interior Design",
      text: image.prompt,
      url: image.image_url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          toast.error("Failed to share");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(image.image_url);
        toast.success("Image URL copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy URL");
      }
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Error copying prompt:", error);
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Image Details</DialogTitle>
        </DialogHeader>
        
        {/* Image Container */}
        <div className="relative w-full bg-secondary/20">
          <img
            src={image.image_url}
            alt={image.prompt}
            className="w-full h-auto max-h-[60vh] object-contain"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Metadata Section */}
        <div className="p-6 space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleCopyPrompt} className="gap-2">
              <FileText className="h-4 w-4" />
              Copy Prompt
            </Button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Style */}
            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
              <Palette className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Style</p>
                <p className="font-medium text-foreground">{image.style}</p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
              <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="font-medium text-foreground">
                  {format(new Date(image.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">Prompt</p>
            </div>
            <p className="text-foreground leading-relaxed">{image.prompt}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
