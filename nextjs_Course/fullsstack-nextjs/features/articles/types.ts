import { type update, type add } from '@/features/articles/validators';
import { type z } from 'zod';

export interface Article {
  id: number;
  title: string;
}

export type CreateArticleInput = z.infer<typeof add>;
// infer แปลว่าให้ infer ชนิดข้อมูลจากโครงสร้างที่เราเขียนในกฎ validate
export type UpdateArticleInput = z.infer<typeof update>;
