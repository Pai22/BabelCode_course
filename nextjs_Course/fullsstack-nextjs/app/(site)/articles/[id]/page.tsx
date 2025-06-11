import { findById } from '@/features/articles/api';
import ArticleDetail from '@/features/articles/components/ArticleDetail';
import { type ArticleDetails } from '@/features/articles/types';
import { revalidatePath } from 'next/cache';
import { update } from '@/features/articles/admin/api';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}
// ตอนมัน build ต้องให้มันเตรียมผลลัพธ์ของ article ที่มี id เป็น 1 หรือ id ที่ต้องการจะเตรียม
export const generateStaticParams = () => {
  return [{ id: '1' }, { id: '2' }];
};

// Server Action
const updateArticle = async (id: ArticleDetails['id']) => {
  'use server'; // บ่งบอกว่า function นี้กระทำอยู่ฝั่ง server เพราะจะส่ง function นี้ไปทำงานในส่วนของ client component
  await update(+id, { title: 'yyy' });
  revalidatePath(`/article/${id}`); // บ่งบอกว่าให้ path นี้ build ใหม่
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { id } = await params;
  const article = await findById(+id);

  if (!article) return <div>No article found</div>;
  return <ArticleDetail article={article} onUpdate={updateArticle} />;
};
export default ArticlePage;
