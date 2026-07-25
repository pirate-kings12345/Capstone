/**
 * useCamera.ts
 *
 * React hook for native camera and gallery integration.
 *
 * Handles the full permission â†’ capture flow:
 * 1. Check permission status
 * 2. Request if not granted
 * 3. Navigate to permission denied screen if denied
 * 4. Open native camera or gallery
 * 5. Return image data URL
 *
 * Phase 2 â€” Image capture only. No AI analysis.
 */

import { useState, useCallback } from 'react';
import { takePhoto, pickFromGallery, isNativePlatform, type CaptureResult } from '../../native/NativeCamera';
import {
  checkPermissions,
  requestPermissions,
  isPermissionGranted,
  isPermanentlyDenied,
  type PermissionStatus,
} from '../../native/NativePermissions';
import { useAppNavigation } from '../../navigation/AppNavigator';

export interface UseCameraState {
  /** The captured image as a data URL (or null if none) */
  capturedImage: string | null;
  /** True while the camera/gallery is opening or capturing */
  isCapturing: boolean;
  /** Last error message, if any */
  error: string | null;
  /** Current camera permission status */
  cameraPermissionStatus: PermissionStatus;
  /** Current photos/gallery permission status */
  galleryPermissionStatus: PermissionStatus;
}

export interface UseCameraActions {
  /** Open native camera shutter */
  takePhoto: () => Promise<void>;
  /** Open native gallery picker */
  pickFromGallery: () => Promise<void>;
  /** Clear the captured image and reset state */
  clearImage: () => void;
  /** Manually re-check permission statuses */
  refreshPermissions: () => Promise<void>;
}

export function useCamera(): UseCameraState & UseCameraActions {
  const { navigate } = useAppNavigation();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<PermissionStatus>('prompt');
  const [galleryPermissionStatus, setGalleryPermissionStatus] = useState<PermissionStatus>('prompt');

  const refreshPermissions = useCallback(async () => {
    const p = await checkPermissions();
    setCameraPermissionStatus(p.camera);
    setGalleryPermissionStatus(p.photos);
  }, []);

  /**
   * Ensure camera permission is granted before capture.
   * Returns true if permission is usable, false if denied.
   */
  const ensureCameraPermission = useCallback(async (): Promise<boolean> => {
    let p = await checkPermissions();

    if (isPermissionGranted(p.camera)) {
      setCameraPermissionStatus(p.camera);
      return true;
    }

    if (isPermanentlyDenied(p.camera)) {
      setCameraPermissionStatus('denied');
      navigate('CameraPermissionDenied');
      return false;
    }

    // Prompt
    p = await requestPermissions();
    setCameraPermissionStatus(p.camera);

    if (isPermanentlyDenied(p.camera)) {
      navigate('CameraPermissionDenied');
      return false;
    }

    return isPermissionGranted(p.camera);
  }, [navigate]);

  /**
   * Ensure gallery permission is granted before picking.
   * Returns true if usable, false if denied.
   */
  const ensureGalleryPermission = useCallback(async (): Promise<boolean> => {
    let p = await checkPermissions();

    if (isPermissionGranted(p.photos)) {
      setGalleryPermissionStatus(p.photos);
      return true;
    }

    if (isPermanentlyDenied(p.photos)) {
      setGalleryPermissionStatus('denied');
      navigate('GalleryPermissionDenied');
      return false;
    }

    // Prompt
    p = await requestPermissions();
    setGalleryPermissionStatus(p.photos);

    if (isPermanentlyDenied(p.photos)) {
      navigate('GalleryPermissionDenied');
      return false;
    }

    return isPermissionGranted(p.photos);
  }, [navigate]);

  const handleTakePhoto = useCallback(async () => {
    setError(null);
    setIsCapturing(true);

    try {
      // On native: check permissions
      if (isNativePlatform()) {
        const ok = await ensureCameraPermission();
        if (!ok) {
          setIsCapturing(false);
          return;
        }
      }

      const result: CaptureResult = await takePhoto();
      setCapturedImage(result.dataUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // User cancelled â€” don't treat as error
      if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('dismissed')) {
        setError(null);
      } else {
        setError('Could not capture photo. Please try again.');
      }
    } finally {
      setIsCapturing(false);
    }
  }, [ensureCameraPermission]);

  const handlePickFromGallery = useCallback(async () => {
    setError(null);
    setIsCapturing(true);

    try {
      // On native: check permissions
      if (isNativePlatform()) {
        const ok = await ensureGalleryPermission();
        if (!ok) {
          setIsCapturing(false);
          return;
        }
      }

      const result: CaptureResult = await pickFromGallery();
      setCapturedImage(result.dataUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('dismissed')) {
        setError(null);
      } else {
        setError('Could not open gallery. Please try again.');
      }
    } finally {
      setIsCapturing(false);
    }
  }, [ensureGalleryPermission]);

  const clearImage = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  return {
    capturedImage,
    isCapturing,
    error,
    cameraPermissionStatus,
    galleryPermissionStatus,
    takePhoto: handleTakePhoto,
    pickFromGallery: handlePickFromGallery,
    clearImage,
    refreshPermissions,
  };
}
