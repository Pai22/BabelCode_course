import db from '@/features/shared/db';
import { type z } from 'zod';
import type * as validators from './validators';
import { slugify } from '@/features/shared/helpers/slugify';
import { revalidatePath } from 'next/cache';
import { saveFile } from '@/features/shared/helpers/file';

export const add = async (input: z.infer<typeof validators.add>) => {
  if (!input.image) {
    throw new Error('No file uploaded');
  }
  const image = await saveFile(input.image);
  const article = await db.article.create({
    data: {
      ...input,
      userId: 1, // ใส่ไปก่อนเพราะยังไม่มีระบบ login
      image,
      slug: slugify(input.title),
    },
  });
  revalidatePath('/articles'); //add แล้วให้ไปเพิ่มข้อมูลใหม่

  return article;
};

export const update = async (
  id: number,
  input: z.infer<typeof validators.update>,
) => {
  const article = await db.article.update({
    where: { id },
    data: {
      ...input,
      image: 'http://123456.com',
      userId: 1,
      slug: input.title ? slugify(input.title) : undefined,
    },
  });

  revalidatePath('/articles');
  revalidatePath(`/articles/${id}`);

  return article;
};

export const remove = async (id: number) => {
  const article = await db.article.delete({
    where: { id },
  });

  revalidatePath('/articles');
  revalidatePath(`/articles/${id}`);

  return article;
};
