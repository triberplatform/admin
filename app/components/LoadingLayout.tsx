
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoadingStore } from '../lib/store';


export default function LoadingStateManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setLoading } = useLoadingStore();

  // Reset loading state when navigation completes
  useEffect(() => {
    // Navigation has completed, turn off loading state
    setLoading(false);
  }, [pathname, searchParams, setLoading]);

  return <>{children}</>;
}