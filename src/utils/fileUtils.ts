/**
 * Utility functions for client-side image processing, compression,
 * Supabase Storage bucket integration, and lightweight persistence.
 */

import { uploadToStorageBucket, getStorageBucketName, isSupabaseConfigured } from '../lib/supabase';

export interface ProcessedAttachment {
  name: string;
  dataUrl: string; // Public bucket URL or compressed base64 data URL fallback
  sizeBytes: number;
  originalSizeBytes: number;
  savingsPercent: number;
  type: string;
  isImage: boolean;
  isBucketUrl: boolean;
  storagePath?: string;
}

export interface CompressedImageResult {
  blob: Blob;
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  savingsPercent: number;
  width: number;
  height: number;
  type: string;
}

/**
 * Format bytes into human-readable string (e.g., 2.4 MB, 142 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Sanitize a filename for cloud storage bucket path
 */
export function sanitizeStorageFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Compresses an image File using HTML5 canvas downscaling and bicubic interpolation.
 * Produces both a lightweight Blob (for bucket upload) and a Data URL (for local preview/fallback).
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.75
): Promise<CompressedImageResult> {
  const originalSizeBytes = file.size;

  // Handle SVG vector graphics directly without raster downscaling
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = (reader.result as string) || '';
        const blob = new Blob([file], { type: 'image/svg+xml' });
        resolve({
          blob,
          dataUrl,
          originalSizeBytes,
          compressedSizeBytes: originalSizeBytes,
          savingsPercent: 0,
          width: 800,
          height: 600,
          type: 'image/svg+xml'
        });
      };
      reader.onerror = () => {
        resolve({
          blob: file,
          dataUrl: '',
          originalSizeBytes,
          compressedSizeBytes: originalSizeBytes,
          savingsPercent: 0,
          width: 0,
          height: 0,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Downscale proportionally if either dimension exceeds maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            const rawDataUrl = e.target?.result as string;
            resolve({
              blob: file,
              dataUrl: rawDataUrl,
              originalSizeBytes,
              compressedSizeBytes: file.size,
              savingsPercent: 0,
              width: img.width,
              height: img.height,
              type: file.type
            });
            return;
          }

          // Enable high-quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Solid background fill to ensure clean JPEG conversion without black transparency artifacts
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Attempt canvas blob export
          const outputMime = 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(outputMime, quality);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // Fallback if toBlob fails
                const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
                const savings = Math.max(
                  0,
                  Math.round(((originalSizeBytes - approxBytes) / originalSizeBytes) * 100)
                );
                resolve({
                  blob: file,
                  dataUrl: compressedDataUrl,
                  originalSizeBytes,
                  compressedSizeBytes: approxBytes,
                  savingsPercent: savings,
                  width,
                  height,
                  type: outputMime
                });
                return;
              }

              const compressedSizeBytes = blob.size;
              const savingsPercent = Math.max(
                0,
                Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
              );

              resolve({
                blob,
                dataUrl: compressedDataUrl,
                originalSizeBytes,
                compressedSizeBytes,
                savingsPercent,
                width,
                height,
                type: outputMime
              });
            },
            outputMime,
            quality
          );
        } catch (err) {
          console.warn('Canvas compression error, using fallback:', err);
          resolve({
            blob: file,
            dataUrl: (e.target?.result as string) || '',
            originalSizeBytes,
            compressedSizeBytes: file.size,
            savingsPercent: 0,
            width: img.width || 0,
            height: img.height || 0,
            type: file.type
          });
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk'));
    reader.readAsDataURL(file);
  });
}

/**
 * Processes an uploaded file:
 * 1. Compresses image files to an optimized footprint.
 * 2. Uploads the compressed image to the Supabase Storage Bucket if configured.
 * 3. Returns a ProcessedAttachment with public URL (or offline base64 fallback) and compression statistics.
 */
export async function uploadImageWithCompression(
  file: File,
  options: {
    folder?: string;
    maxDimension?: number;
    quality?: number;
    bucketName?: string;
  } = {}
): Promise<ProcessedAttachment> {
  const {
    folder = 'projects',
    maxDimension = 1200,
    quality = 0.75,
    bucketName = getStorageBucketName()
  } = options;

  const isImage = file.type.startsWith('image/');

  if (!isImage) {
    // Non-image file (e.g. PDF utility bill or inspection document)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        let finalUrl = dataUrl;
        let isBucketUrl = false;
        let storagePath: string | undefined;

        if (isSupabaseConfigured()) {
          const timestamp = Date.now();
          const cleanName = sanitizeStorageFileName(file.name);
          const destination = `${folder}/${timestamp}-${cleanName}`;
          const uploaded = await uploadToStorageBucket(file, destination, bucketName);
          if (uploaded) {
            finalUrl = uploaded.publicUrl;
            isBucketUrl = true;
            storagePath = uploaded.path;
          }
        }

        resolve({
          name: file.name,
          dataUrl: finalUrl,
          sizeBytes: file.size,
          originalSizeBytes: file.size,
          savingsPercent: 0,
          type: file.type || 'application/octet-stream',
          isImage: false,
          isBucketUrl,
          storagePath
        });
      };
      reader.onerror = () => {
        resolve({
          name: file.name,
          dataUrl: '',
          sizeBytes: file.size,
          originalSizeBytes: file.size,
          savingsPercent: 0,
          type: file.type || 'application/octet-stream',
          isImage: false,
          isBucketUrl: false
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // 1. Compress Image
  const compressed = await compressImageFile(file, maxDimension, quality);

  let finalUrl = compressed.dataUrl;
  let isBucketUrl = false;
  let storagePath: string | undefined;

  // 2. Upload to Supabase Storage Bucket if client is configured
  if (isSupabaseConfigured()) {
    const timestamp = Date.now();
    const entropy = Math.random().toString(36).substring(2, 9);
    const cleanBaseName = sanitizeStorageFileName(file.name.replace(/\.[^/.]+$/, '')) || 'image';
    const destination = `${folder}/${timestamp}-${entropy}-${cleanBaseName}.jpg`;

    const uploaded = await uploadToStorageBucket(compressed.blob, destination, bucketName);
    if (uploaded) {
      finalUrl = uploaded.publicUrl;
      isBucketUrl = true;
      storagePath = uploaded.path;
    }
  }

  return {
    name: file.name,
    dataUrl: finalUrl,
    sizeBytes: compressed.compressedSizeBytes,
    originalSizeBytes: compressed.originalSizeBytes,
    savingsPercent: compressed.savingsPercent,
    type: compressed.type,
    isImage: true,
    isBucketUrl,
    storagePath
  };
}

/**
 * Backwards-compatible alias for processUploadFile, now powered by
 * automatic compression and storage bucket integration.
 */
export async function processUploadFile(
  file: File,
  maxDimension = 1200,
  quality = 0.75,
  folder = 'leads'
): Promise<ProcessedAttachment> {
  return uploadImageWithCompression(file, {
    folder,
    maxDimension,
    quality
  });
}
