import { faker } from '@faker-js/faker';
import {
  type CreateArticleInput,
  type Article,
  type UpdateArticleInput,
} from '@/features/articles/types';

const length = faker.helpers.rangeToNumber({ min: 3, max: 10 }); // จำลองความยาวของ articles
let articles = Array.from({ length }).map(() => ({
  id: faker.number.int(), // จำนวนเต็ม
  title: faker.lorem.sentence(), // gxHoxitFp8
}));

export const findAll = () => {
  return Promise.resolve(articles);
};

export const findById = async (id: Article['id']) => {
  const article = articles.find((article) => article.id === id); //ใช้ find ในกาวนลูปเช็คว่า article.id ตรงกับ id ที่รับมารึเปล่า

  if (!article) return Promise.resolve(null); //กรณีหา article ไม่เจอ

  return Promise.resolve(article); // ใช้ Promise เพราะต้องการทำให้ฟังก์ชันนี้เป็น Promise ตอนเรียกใช้งานจะได้ await ได้เลย
};

export const create = (form: CreateArticleInput) => {
  const article = {
    id: faker.number.int(),
    ...form,
  };

  articles.push(article);
  return Promise.resolve(article);
};

export const update = async (id: Article['id'], form: UpdateArticleInput) => {
  const article = await findById(id);
  if (!article) return Promise.resolve(null);

  Object.assign(article, form); // แปลเป็น javascript โดยใช้ Object.assign()
  return Promise.resolve(article);
};

export const remove = (id: Article['id']) => {
  const index = articles.findIndex((article) => article.id === id); // findIndex หาว่าข้อมูลนั้นอยู่ในตำแหน่งไหน คืนค่าเป็น index
  const newArticles = [
    ...articles.slice(0, index), //slice ณ ที่นี้คือ เลือกเอาค่าตั้งแต่ตัวแรก จนถึงก่อนหน้า index ที่เราไม่ต้องการ คืนค่าเป็น array
    ...articles.slice(index + 1), // เลือกเอาตั้งแต่หลัง index เป็นต้นไปจนหมด
  ];

  articles = newArticles;
  return Promise.resolve(index); // ถ้าหาข้อมูลไม่เจอ index จะเป็น -1
};
