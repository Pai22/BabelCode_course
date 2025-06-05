import { type findAll } from '@/features/articles/api';
import Link from 'next/link';

interface ArticleListProps {
  articles: Awaited<ReturnType<typeof findAll>>;
  // RetrunType คือ เข้าถึงสิ่งที่คืนออกมาจากฟังก์ชันก่อน
  //ของที่มันคืนออกมาติด promise จึงต้องใส่ await เพื่อให้เอาแต่ใส่ใน
  //จะได้ articles ที่ sync กับ api แล้ว
}

const ArticleList = ({ articles }: ArticleListProps) => {
  return (
    <>
      <ul>
        {articles.map((articles) => (
          <li key={articles.id}>
            <Link href={`/articles/${articles.id}`}>{articles.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
export default ArticleList;
