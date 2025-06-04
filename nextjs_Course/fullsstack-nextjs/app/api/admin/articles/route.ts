import { create } from '@/features/articles/api';
import { type CreateArticleInput } from '@/features/articles/types';
import { add } from '@/features/articles/validators';
import { revalidatePath } from 'next/cache';

export const POST = async (req: Request) => {
  const form = await (req.json() as Promise<CreateArticleInput>);
  const formValidation = await add.safeParseAsync(form); // เช็คว่าข้อมูลใน form ของเราตรงตามกฎที่มีใน add หรือเปล่า

  if (!formValidation.success) {
    return new Response(JSON.stringify(formValidation.error), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const article = await create(formValidation.data); // ทำการสร้างข้อมูลเสร็จเรียบร้อย
  revalidatePath('/articles'); // ข้อมูลไม่อัพเดตแล้วนะ แล้วก็ generate ใหม่ให้หน่อยเพราะตอนนี้มีของใหม่แล้ว
  return new Response(JSON.stringify(article), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
// การทำ http POST จะต้องมีการส่งข้อมูลมาจากฝั่งของ client ด้วย ข้อมูลที่ส่งมาคือ payload
// payload คือส่วนของ body ที่อยู่ในฟอร์มที่ส่งเข้ามาเพื่อทำการสร้าง
