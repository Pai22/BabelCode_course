import {
  type ArticleDetails,
  type ArticleItem,
} from '@/features/articles/types';
import { useEffect, useState } from 'react';

export const useGetArticles = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  const fetchArticles = async () => {
    const res = await fetch('/api/articles');
    const articles = await (res.json() as Promise<ArticleItem[]>);

    setArticles(articles);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return articles;
};

export const useGetArticle = (id: ArticleDetails['id']) => {
  const [article, setArticle] = useState<ArticleDetails>();

  const fetchArticle = async () => {
    const res = await fetch(`/api/articles/${id}`);
    const article = await (res.json() as Promise<ArticleDetails>);

    setArticle(article);
  };

  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return article;
};
