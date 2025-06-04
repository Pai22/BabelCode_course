import { findById } from '@/features/articles/api';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const article = await findById(+id);

  return Response.json(article);
};
