'use client';

import { useCallback } from 'react';
import { useServiceWorker, useOnlineStatus, useInstallPrompt } from '@/lib/hooks/usePWA';
import OfflineIndicator from './OfflineIndicator';
import InstallPrompt from './InstallPrompt';
import UpdateBanner from './UpdateBanner';

export default function PWAProvider({ children }) {
  const { updateAvailable, applyUpdate } = useServiceWorker();
  const isOnline = useOnlineStatus();
  const { canInstall, install } = useInstallPrompt();

  const handleInstall = useCallback(async () => {
    await install();
  }, [install]);

  return (
    <>
      {children}

      {!isOnline && <OfflineIndicator />}

      {updateAvailable && <UpdateBanner onUpdate={applyUpdate} />}

      {canInstall && !updateAvailable && <InstallPrompt onInstall={handleInstall} />}
    </>
  );
}
