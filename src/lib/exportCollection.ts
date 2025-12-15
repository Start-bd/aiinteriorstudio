import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface ExportImage {
  id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}

interface ExportCollection {
  name: string;
  description: string | null;
}

const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    return await response.blob();
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

const fetchImageAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image as base64:", error);
    return null;
  }
};

export const exportCollectionAsZip = async (
  collection: ExportCollection,
  images: ExportImage[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  if (images.length === 0) {
    toast.error("No images to export");
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder(collection.name.replace(/[^a-zA-Z0-9]/g, "_"));
  
  if (!folder) {
    toast.error("Failed to create ZIP folder");
    return;
  }

  let processed = 0;
  const total = images.length;

  for (const image of images) {
    const blob = await fetchImageAsBlob(image.image_url);
    if (blob) {
      const filename = `${image.style}_${image.id.slice(0, 8)}.png`;
      folder.file(filename, blob);
      
      // Create metadata file for each image
      const metadata = {
        prompt: image.prompt,
        style: image.style,
        created_at: image.created_at,
      };
      folder.file(`${filename}.json`, JSON.stringify(metadata, null, 2));
    }
    
    processed++;
    onProgress?.(Math.round((processed / total) * 100));
  }

  // Add collection info
  const collectionInfo = {
    name: collection.name,
    description: collection.description,
    image_count: images.length,
    exported_at: new Date().toISOString(),
  };
  folder.file("collection_info.json", JSON.stringify(collectionInfo, null, 2));

  try {
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${collection.name.replace(/[^a-zA-Z0-9]/g, "_")}.zip`);
    toast.success("Collection exported as ZIP!");
  } catch (error) {
    console.error("Error generating ZIP:", error);
    toast.error("Failed to generate ZIP file");
  }
};

export const exportCollectionAsPdf = async (
  collection: ExportCollection,
  images: ExportImage[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  if (images.length === 0) {
    toast.error("No images to export");
    return;
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Title page
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.text(collection.name, pageWidth / 2, 60, { align: "center" });

  if (collection.description) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    const descLines = pdf.splitTextToSize(collection.description, contentWidth);
    pdf.text(descLines, pageWidth / 2, 80, { align: "center" });
  }

  pdf.setFontSize(10);
  pdf.setTextColor(128);
  pdf.text(`${images.length} images`, pageWidth / 2, 100, { align: "center" });
  pdf.text(`Exported on ${new Date().toLocaleDateString()}`, pageWidth / 2, 108, { align: "center" });
  pdf.setTextColor(0);

  let processed = 0;
  const total = images.length;

  // Add images
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    pdf.addPage();

    // Fetch and add image
    const base64 = await fetchImageAsBase64(image.image_url);
    if (base64) {
      const imgSize = Math.min(contentWidth, pageHeight * 0.5);
      const x = (pageWidth - imgSize) / 2;
      pdf.addImage(base64, "PNG", x, margin, imgSize, imgSize);

      // Add metadata below image
      const textY = margin + imgSize + 15;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Style: ${image.style}`, margin, textY);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const promptLines = pdf.splitTextToSize(`Prompt: ${image.prompt}`, contentWidth);
      pdf.text(promptLines, margin, textY + 8);
      
      pdf.setTextColor(128);
      pdf.text(
        `Created: ${new Date(image.created_at).toLocaleDateString()}`,
        margin,
        textY + 8 + promptLines.length * 4 + 6
      );
      pdf.setTextColor(0);

      // Page number
      pdf.setFontSize(8);
      pdf.text(`${i + 1} / ${images.length}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    processed++;
    onProgress?.(Math.round((processed / total) * 100));
  }

  try {
    pdf.save(`${collection.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    toast.success("Collection exported as PDF!");
  } catch (error) {
    console.error("Error saving PDF:", error);
    toast.error("Failed to save PDF file");
  }
};
