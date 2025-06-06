import { z } from 'zod';

export const add = z.object({
  title: z.string(),
});

export const update = add.partial(); // ใส่ .partial แปลว่า ทุกตัวใน add ใส่ option
