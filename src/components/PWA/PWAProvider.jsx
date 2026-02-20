'use client';

import { useCallback } from 'react';
import { useServiceWorker, useOnlineStatus, useInstallPrompt } from '@/lib/hooks/usePWA';
import OfflineIndicator from './OfflineIndicator';
import InstallPrompt from './InstallPrompt';

export default function PWAProvider({ children }) {
  useServiceWorker();
  const isOnline = useOnlineStatus();
  const { canInstall, install } = useInstallPrompt();

  const handleInstall = useCallback(async () => {
    await install();
  }, [install]);

  return (
    <>
      {children}

      {!isOnline && <OfflineIndicator />}

      {canInstall && <InstallPrompt onInstall={handleInstall} />}
    </>
  );
}
