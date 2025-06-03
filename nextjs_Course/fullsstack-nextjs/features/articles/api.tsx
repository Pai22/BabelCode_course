import { faker } from '@faker-js/faker';
import { type Article } from '@/features/articles/types';

export const findAll = () => {
  const length = faker.helpers.rangeToNumber({ min: 3, max: 10 }); // จำลองความยาวของ articles
  const articles = Array.from({ length }).map(() => ({
    id: faker.number.int(), // จำนวนเต็ม
    title: faker.lorem.sentence(), // gxHoxitFp8
  }));

  return Promise.resolve(articles); // ต้องใส่ Promise เพราะตัว nodejs retun เป็น Promise มันจะคืนค่า articles โดยตรงเมื่อมัน await เสร็จเรียบร้อยแล้ว
  //การเชื่อมต่อกับฐานข้อมูลที่มีแนวโน้มจะใช้เวลานานๆมันจะคืนค่าเป็น promise
};

export const findById = async (id: Article['id']) => {
  const res = await fetch(`http://localhost:5151/announcements/${id}`, {
    next: { revalidate: 15 }, // ทำ ssg + validate = isr
  });

  return res.json() as Promise<Article>;
};
