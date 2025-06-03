import { type Article } from '@/features/articles/types';

interface ArticleDetailProps {
  article: Article;
}
const ArticleDetail = ({ article }: ArticleDetailProps) => {
  return <div>{article.title}</div>;
};
export default ArticleDetail;
