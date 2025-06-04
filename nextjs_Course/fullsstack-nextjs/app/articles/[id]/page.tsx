import { findById } from '@/features/articles/api';
import ArticleDetail from '@/features/articles/components/ArticleDetail';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}
// ตอนมัน build ต้องให้มันเตรียมผลลัพธ์ของ article ที่มี id เป็น 1 หรือ id ที่ต้องการจะเตรียม
export const generateStaticParams = () => {
  return [{ id: '1' }, { id: '2' }];
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { id } = await params;
  const article = await findById(+id);

  if (!article) return <div>No article found</div>;

  return <ArticleDetail article={article} />;
};
export default ArticlePage;
