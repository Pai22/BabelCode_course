import { type add, type update } from '@/features/articles/admin/api';

export type AddAritcleInput = Parameters<typeof add>[0];

export type UpdateAritcleInput = Parameters<typeof update>[0];
