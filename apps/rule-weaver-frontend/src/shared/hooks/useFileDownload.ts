import { toast } from "sonner";

/**
 * Hook to handle file downloads
 * @returns Function to download content as a file
 */
export function useFileDownload() {
  /**
   * Downloads content as a file
   * @param value - The content to download (string or object)
   * @param fileName - The name of the file to download
   * @param mimeType - The MIME type of the file (defaults to application/json)
   * @returns A promise that resolves when the download is complete
   */
  const downloadFile = (
    value: unknown,
    fileName: string,
    mimeType: string = "application/json"
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Convert value to string if it's an object
        const content =
          typeof value === "string" ? value : JSON.stringify(value, null, 2);

        // Create blob and URL
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        // Create and trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(`Downloaded successfully`);
        resolve();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        toast.error(`Failed to download file: ${errorMessage}`);
        reject(err);
      }
    });
  };

  return { downloadFile };
}
