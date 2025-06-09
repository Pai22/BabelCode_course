'use client';

import ArticleList from '@/features/articles/admin/components/ArticleList';
import { useGetArticles } from '@/features/articles/admin/hooks/api';

const ArticlesPage = () => {
  const articles = useGetArticles();

  if (!articles || articles.length === 0) return <div>No articles found</div>;

  return <ArticleList articles={articles} />;
};
export default ArticlesPage;
