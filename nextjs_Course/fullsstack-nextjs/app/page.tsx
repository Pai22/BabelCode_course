'use client';

import { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);

  const fetchArticles = async () => {
    const res = await fetch(url);
    const data = await (res.json() as Promise<T[]>);

    //ย้าย state จาก API มาฝั่ง Client
    setData(data);
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}

const ArticlePage = () => {
  const articles = useFetch<Article>('http://localhost:5151/articles');
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
};
export default ArticlePage;
