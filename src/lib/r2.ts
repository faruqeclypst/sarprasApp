/**
 * Cloudflare R2 Storage Service
 * Handles file operations with Cloudflare R2 S3-compatible storage
 */

const R2_CONFIG = {
  endpoint: import.meta.env.VITE_R2_ENDPOINT,
  accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  bucket: import.meta.env.VITE_R2_BUCKET,
  publicBaseUrl: import.meta.env.VITE_R2_PUBLIC_BASE_URL,
};

interface R2Object {
  Key: string;
  LastModified?: Date;
  Size?: number;
  StorageClass?: string;
}

class R2Service {
  private baseUrl: string;
  private credentials: string;

  constructor() {
    this.baseUrl = `${R2_CONFIG.endpoint}/${R2_CONFIG.bucket}`;
    this.credentials = btoa(`${R2_CONFIG.accessKeyId}:${R2_CONFIG.secretAccessKey}`);
  }

  /**
   * Delete a file from R2 storage
   * @param fileUrl - The full URL of the file to delete
   * @returns Promise<boolean> - True if deleted successfully
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl) return true; // No file to delete

      // Extract the key from the URL
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        console.warn('Could not extract key from URL:', fileUrl);
        return false;
      }

      const response = await fetch(`${this.baseUrl}/${key}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${this.credentials}`,
          'Content-Type': 'application/xml',
        },
      });

      if (response.ok) {
        console.log('Successfully deleted file from R2:', key);
        return true;
      } else {
        console.error('Failed to delete file from R2:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting file from R2:', error);
      return false;
    }
  }

  /**
   * Delete multiple files from R2 storage
   * @param fileUrls - Array of file URLs to delete
   * @returns Promise<boolean[]> - Array of deletion results
   */
  async deleteFiles(fileUrls: string[]): Promise<boolean[]> {
    const results = await Promise.allSettled(
      fileUrls.map(url => this.deleteFile(url))
    );

    return results.map(result =>
      result.status === 'fulfilled' ? result.value : false
    );
  }

  /**
   * Extract the object key from a full R2 URL
   * @param url - The full URL of the file
   * @returns string | null - The object key or null if not found
   */
  private extractKeyFromUrl(url: string): string | null {
    try {
      // If it's already just a key/path, return it
      if (!url.includes('://')) {
        return url;
      }

      // Extract from full URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);

      // Remove bucket name if present
      if (pathParts[0] === R2_CONFIG.bucket) {
        pathParts.shift();
      }

      return pathParts.join('/');
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }

  /**
   * Check if a URL is from our R2 storage
   * @param url - The URL to check
   * @returns boolean - True if URL is from our R2 storage
   */
  isR2Url(url: string): boolean {
    if (!url) return false;
    return url.includes(R2_CONFIG.publicBaseUrl) || url.includes(R2_CONFIG.endpoint);
  }

  /**
   * Get the public URL for a file key
   * @param key - The object key
   * @returns string - The public URL
   */
  getPublicUrl(key: string): string {
    return `${R2_CONFIG.publicBaseUrl}/${key}`;
  }
}

// Export singleton instance
export const r2Service = new R2Service();
export default r2Service;