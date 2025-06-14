import { findBySlug } from '@/features/articles/api';
import ArticleDetail from '@/features/articles/components/ArticleDetail';
import { getImagePath } from '@/features/shared/helpers/upload';
import { type Metadata } from 'next';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}
// ตอนมัน build ต้องให้มันเตรียมผลลัพธ์ของ article ที่มี slug เป็น 1 หรือ slug ที่ต้องการจะเตรียม
export const generateStaticParams = () => {
  return [{ slug: '1' }, { slug: '2' }];
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await findBySlug(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      images: getImagePath(article.image),
    },
  };
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug } = await params;
  const article = await findBySlug(slug);

  if (!article) return <div>No article found</div>;
  return <ArticleDetail article={article} />;
};
export default ArticlePage;
