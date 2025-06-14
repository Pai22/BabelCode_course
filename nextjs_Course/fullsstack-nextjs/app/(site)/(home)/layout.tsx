import { type ReactNode } from 'react';

interface HomeLayoutPrps {
  children: ReactNode;
  articles: ReactNode;
  announcements: ReactNode;
  // articles กับ announcements ที่ประกาศมีตาม route @ ที่สร้าง
}

const HomeLayout = ({ children, articles, announcements }: HomeLayoutPrps) => {
  return (
    <>
      {children}
      {articles}
      {announcements}
    </>
  );
};
export default HomeLayout;
