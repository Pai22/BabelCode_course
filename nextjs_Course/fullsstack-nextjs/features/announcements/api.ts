import { type Announcement } from '@/features/announcements/types';
import { faker } from '@faker-js/faker';

export const findAll = () => {
  const length = faker.helpers.rangeToNumber({ min: 3, max: 10 }); // จำลองความยาวของ announcements
  const announcements = Array.from({ length }).map(() => ({
    id: faker.number.int(), // จำนวนเต็ม
    title: faker.lorem.sentence(), // gxHoxitFp8
  }));

  return Promise.resolve(announcements); // ต้องใส่ Promise เพราะตัว nodejs retun เป็น Promise มันจะคืนค่า announcements โดยตรงเมื่อมัน await เสร็จเรียบร้อยแล้ว
  //การเชื่อมต่อกับฐานข้อมูลที่มีแนวโน้มจะใช้เวลานานๆมันจะคืนค่าเป็น promise
};

// fetch api ไปดึง api โดยตรง

export const findById = async (id: Announcement['id']) => {
  const res = await fetch(`http://localhost:5151/announcements/${id}`, {
    cache: 'no-store', // 'no-store' is ไม่ต้องจดจำค่าไว้ใน cache ถ้าทำแบบ ssg ไม่ต้องใส่เลย
  });
  // ใส่ cache ทำให้เกิดการทำงานแบบ ssr
  return res.json() as Promise<Announcement>;
};
