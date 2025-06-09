import { type findAll, type findById } from '@/features/articles/api';

export type ArticleItem = Awaited<ReturnType<typeof findAll>>[number];

export type ArticleDetails = NonNullable<Awaited<ReturnType<typeof findById>>>;
// NonNullable เอา null ออก
