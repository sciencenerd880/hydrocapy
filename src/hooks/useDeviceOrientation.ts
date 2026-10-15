'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface OrientationData {
  gamma: number; // Left/Right tilt (-90 to 90)
  beta: number;  // Front/Back tilt (-180 to 180)
  isSupported: boolean;
  permissionState: 'prompt' | 'granted' | 'denied' | 'not-needed';
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<OrientationData>({
    gamma: 0,
    beta: 0,
    isSupported: false,
    permissionState: 'prompt',
  });

  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number; isInteracting: boolean }>({
    x: 0,
    y: 0,
    isInteracting: false,
  });

  const isListenerAttached = useRef(false);

  // Check support on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasOrientationEvent = 'DeviceOrientationEvent' in window;
    const needsPermission =
      typeof (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } })
        .DeviceOrientationEvent?.requestPermission === 'function';

    setOrientation((prev) => ({
      ...prev,
      isSupported: hasOrientationEvent,
      permissionState: needsPermission ? 'prompt' : 'not-needed',
    }));

    if (hasOrientationEvent && !needsPermission) {
      attachListener();
    }

    return () => {
      detachListener();
    };
  }, []);

  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    // gamma: -90 to 90 (tilt left/right)
    // beta: -180 to 180 (tilt front/back)
    const gamma = event.gamma ?? 0;
    const beta = event.beta ?? 0;

    // Filter small jitter (deadzone)
    const filteredGamma = Math.abs(gamma) < 1.5 ? 0 : gamma;
    const filteredBeta = Math.abs(beta - 45) < 2 ? 0 : beta - 45; // Offset ~45 deg for normal phone viewing angle

    setOrientation((prev) => ({
      ...prev,
      gamma: Math.max(-45, Math.min(45, filteredGamma)),
      beta: Math.max(-45, Math.min(45, filteredBeta)),
    }));
  }, []);

  const attachListener = useCallback(() => {
    if (isListenerAttached.current) return;
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    isListenerAttached.current = true;
  }, [handleDeviceOrientation]);

  const detachListener = useCallback(() => {
    if (!isListenerAttached.current) return;
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    isListenerAttached.current = false;
  }, [handleDeviceOrientation]);

  // Request explicit permission on iOS Safari
  const requestPermission = async () => {
    if (typeof window === 'undefined') return;
    
    const deviceOrientationConstructor = (
      window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }
    ).DeviceOrientationEvent;

    if (typeof deviceOrientationConstructor?.requestPermission === 'function') {
      try {
        const response = await deviceOrientationConstructor.requestPermission();
        if (response === 'granted') {
          setOrientation((prev) => ({ ...prev, permissionState: 'granted' }));
          attachListener();
        } else {
          setOrientation((prev) => ({ ...prev, permissionState: 'denied' }));
        }
      } catch (err) {
        console.error('Error requesting device orientation permission:', err);
        setOrientation((prev) => ({ ...prev, permissionState: 'denied' }));
      }
    } else {
      attachListener();
      setOrientation((prev) => ({ ...prev, permissionState: 'granted' }));
    }
  };

  // Desktop Pointer / Mouse fallback to simulate tilt or water touch
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized from -1 to 1
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    setMouseTilt({
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
      isInteracting: true,
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setMouseTilt({ x: 0, y: 0, isInteracting: false });
  }, []);

  // Compute effective tilt values (Hardware tilt priority, falling back to mouse)
  const effectiveTiltX = orientation.gamma !== 0 ? orientation.gamma / 45 : mouseTilt.x;
  const effectiveTiltY = orientation.beta !== 0 ? orientation.beta / 45 : mouseTilt.y;

  return {
    orientation,
    requestPermission,
    effectiveTiltX,
    effectiveTiltY,
    handlePointerMove,
    handlePointerLeave,
    isPointerActive: mouseTilt.isInteracting,
  };
}
