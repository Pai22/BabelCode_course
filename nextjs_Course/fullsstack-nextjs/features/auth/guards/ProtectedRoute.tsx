'use client';

import { type Role } from '@/app/generated/prisma';
import { useUiStore } from '@/features/ui/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  roles?: Role[];
  children: ReactNode;
}

const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const setToast = useUiStore((state) => state.setToast);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      setToast({ type: 'Error', message: 'Please login before' });
      router.push('/auth/sign-in');
      return;
    }
    if (!roles) return setIsAllowed(true);
    if (session && roles.includes(session?.user.role))
      return setIsAllowed(true);

    setToast({
      type: 'Error',
      message: 'You are not allowed to accsess this page',
    });
    router.replace('/forbidden');
  }, [roles, router, session, session?.user.role, setToast, status]);

  if (status === 'loading') return <div>Loading...</div>;
  if (isAllowed) return <>{children}</>;
  return null;
};
export default ProtectedRoute;
