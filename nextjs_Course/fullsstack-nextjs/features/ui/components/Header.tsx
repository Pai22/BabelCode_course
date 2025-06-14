'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import AuthMenu from '@/features/auth/components/AuthMenu';
import ProtectedResource from '@/features/auth/guards/ProtedResource';

interface NavLinkProps {
  path: string;
  children: ReactNode;
}

const NavLink = ({ path, children }: NavLinkProps) => {
  const pathname = usePathname();

  return (
    <Button
      variant={pathname.startsWith(path) ? 'secondary' : 'ghost'}
      asChild // asChild เป็นการบอกว่า แสดงแท็ก Link แต่ใช้ styles tag button
    >
      <Link href={path}>{children}</Link>
    </Button>
  );
};

const Header = () => {
  return (
    <nav className="flex items-center space-x-4 p-4 shadow-md">
      <Link href="/" className="px-2">
        <Image
          priority
          src="/assets/images/logo.png"
          alt="Absence Management"
          width={50}
          height={50}
        ></Image>
      </Link>
      <ProtectedResource roles={['ADMIN', 'MANAGER']}>
        <NavLink path="/admin">Admin</NavLink>
      </ProtectedResource>
      <NavLink path="/leaves">Leaves</NavLink>
      <NavLink path="/articles">Articles</NavLink>
      <NavLink path="/announcements">Announcements</NavLink>
      <div className="!ml-auto h-[40px] w-[1px] bg-gray-300"></div>
      <AuthMenu></AuthMenu>
    </nav>
  );
};
export default Header;
