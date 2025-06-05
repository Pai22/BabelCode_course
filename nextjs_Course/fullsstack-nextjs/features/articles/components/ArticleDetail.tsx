'use client';

import { type Article } from '@/features/articles/types';

import { useParams } from 'next/navigation';

interface ArticleDetailProps {
  article: Article;
  onUpdate: (id: Article['id']) => void;
}

const ArticleDetail = ({ article, onUpdate }: ArticleDetailProps) => {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  return (
    <div>
      {article.title}
      <button
        onClick={() => onUpdate(article.id)}
        className="bg-amber-800 text-white"
      >
        Update
      </button>
    </div>
  );
};
export default ArticleDetail;
