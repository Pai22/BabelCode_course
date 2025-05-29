import { Book } from "./types";

export const getBooks = async (option?: Parameters<typeof fetch>[1]) => {
  const res = await fetch("http://localhost:3000/api/books", option);
  //มีการรอผลลัพธ์ก่อนถึงจะประมวลผลลัพธ์บรรทัดถัดไปจึงต้องใช้ async/awiat

  return res.json() as Promise<Book[]>;
};
// ต้องมีการประกาศโครงสร้างของ Books ที่ไฟล์ /utils/types.ts
