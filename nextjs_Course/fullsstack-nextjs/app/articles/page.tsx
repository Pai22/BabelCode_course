// ไฟล์นี้ทำเป็น ssg คือ generate html ให้เรียบร้อยตั้งแต่ build
// ssg --> isr
import { findAll } from '@/features/articles/api';
import ArticleList from '@/features/articles/components/ArticleList';

const ArticlesPage = async () => {
  const articles = await findAll();

  return <ArticleList articles={articles} />;
};

export default ArticlesPage;

export const revalidate = 15; // isr
// generate ใหม่ทุกๆ 15 วินาที ในการคืนผลลัพธ์นั้นเมื่อครบ 15 วินาทีแล้ว
// คนแรกที่ requset หลังจาก 15 วิจะยังคงได้ข้อมูลชุดเก่าอยู่พร้อมกับ build ใหม่
// คนที่สอง request มาจะได้ข้อมูลชุดใหม่
