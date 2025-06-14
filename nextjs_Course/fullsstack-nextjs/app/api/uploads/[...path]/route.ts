import { readFile } from 'fs/promises';

interface Params {
  params: Promise<{
    path: string[];
  }>;
}

export const GET = async (_req: Request, { params }: Params) => {
  const { path } = await params;
  const publicDir = __dirname.split('.next')[0] + 'public/uploads/';
  const fileUrl = path.join('/');
  const file = await readFile(`${publicDir}${fileUrl}`);

  return new Response(file);
};
