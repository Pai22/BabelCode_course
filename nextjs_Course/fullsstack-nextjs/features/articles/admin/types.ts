import { type add, type update } from '@/features/articles/admin/api';

export type AddArticleInput = Parameters<typeof add>[1];

export type UpdateAritcleInput = Parameters<typeof update>[1];
