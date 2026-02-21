'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { UserCircleIcon, ImageIcon } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"
import PWAProvider from './PWA/PWAProvider';
import LocationPrompt from './LocationPrompt';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import useVersionData from '@/lib/hooks/useVersionData';
import logout from '@/lib/logout';


export default function LayoutShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, checking, requestPermission } = useGeolocation();
  const { data } = useVersionData();

  const isLoginPage = pathname === '/login';
  const isLocationRequiredPage = pathname === '/location-required';
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('finger');

  const versionData = data;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finger = localStorage.getItem('finger');
    if (finger && isLoginPage) {
      router.replace('/');
      return;
    }
    if (!finger && !isLoginPage) {
      logout();
    }
  }, [pathname, isLoginPage, router]);

  useEffect(() => {
    if (!checking && isLoggedIn && !isLoginPage && status === 'denied' && !isLocationRequiredPage) {
      const perm = localStorage.getItem('location_permission');
      if (perm !== 'deferred') {
        router.replace('/location-required');
      }
    }
  }, [checking, isLoggedIn, isLoginPage, status, isLocationRequiredPage, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const needsLocationPrompt = !isLoginPage && !isLocationRequiredPage && isLoggedIn && (status === 'idle' || status === 'loading') && !checking;



  return (
    <PWAProvider>
      <div className="min-h-screen bg-grey-100 flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[480px] min-h-screen bg-white shadow-xl relative flex flex-col overflow-x-hidden">
          {!isLoginPage && !isLocationRequiredPage && (
            <header className="fixed top-0 w-full z-40 flex h-14 items-center justify-between border-b border-grey-100 bg-white px-4">
              <div className="flex items-center gap-2 min-w-0">
                {versionData?.logo && (
                  <img
                    src={versionData.logo}
                    alt=""
                    className="size-8 shrink-0 rounded object-contain"
                  />
                )}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-primary-600 truncate">
                    {versionData?.name || ''}
                  </span>
                  {versionData?.version && (
                    <span className="text-xs text-grey-500 shrink-0">
                      v{versionData.version}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {versionData?.images?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => router.push('/gallery')}
                    className="flex items-center text-grey-500 hover:text-grey-700 transition-colors"
                  >
                    <ImageIcon className="size-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="flex items-center text-grey-500 hover:text-grey-700 transition-colors"
                >
                  <UserCircleIcon className="size-6" />
                </button>
              </div>
            </header>
          )}
          <Toaster position="top-center" />

          <main className="flex-1 pt-14">{children}</main>
          {needsLocationPrompt && (
            <LocationPrompt
              status={status}
              onAllow={requestPermission}
              onClose={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('location_permission', 'denied');
                  router.replace('/location-required');
                }
              }}
            />
          )}
        </div>
      </div>
    </PWAProvider>
  );
}
