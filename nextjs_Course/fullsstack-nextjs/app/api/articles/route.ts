import { findAll } from '@/features/articles/api';

export const GET = async () => {
  const articles = await findAll();
  return Response.json(articles);
};
// การ new response จะทำให้เราสามารถ ส่งข้อมูลกลับไปได้พร้อมกับสามารถเขียน
// response status ที่เป็น http status กลับไปได้
