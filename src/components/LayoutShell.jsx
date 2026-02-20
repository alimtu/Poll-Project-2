'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { UserCircleIcon } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"
import PWAProvider from './PWA/PWAProvider';
import LocationPrompt from './LocationPrompt';
import { useGeolocation } from '@/lib/hooks/useGeolocation';


export default function LayoutShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, checking, requestPermission } = useGeolocation();

  const isLoginPage = pathname === '/login';
  const isLocationRequiredPage = pathname === '/location-required';
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('finger');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finger = localStorage.getItem('finger');
    if (finger && isLoginPage) {
      router.replace('/');
      return;
    }
    if (!finger && !isLoginPage) {
      localStorage.clear();
      router.replace('/login');
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
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-grey-100 bg-white px-4">
              <p className="text-sm font-bold text-primary-600">ICMS</p>
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="flex items-center gap-1.5 text-grey-500 hover:text-grey-700 transition-colors"
              >
                <UserCircleIcon className="size-6" />
              </button>
            </header>
          )}
          <Toaster position="top-center" />

          <main className="flex-1">{children}</main>
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
