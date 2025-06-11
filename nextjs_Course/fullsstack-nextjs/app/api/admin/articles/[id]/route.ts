import * as api from '@/features/articles/admin/api';
import { type UpdateAritcleInput } from '@/features/articles/admin/types';
import * as validators from '@/features/articles/validators';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  const { id } = await params;
  const form = await (req.json() as Promise<UpdateAritcleInput>);
  const formValidation = await validators.update.safeParseAsync(form);

  if (!formValidation.success) {
    return new Response(JSON.stringify(formValidation.error), {
      status: 422,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const article = await api.update(+id, formValidation.data);
  if (!article) return new Response(null, { status: 404 });

  return Response.json(article);
};

// export const DELETE = async (_req: Request, { params }: Params) => {
//   const { id } = await params;
//   const index = await api.remove(+id);
//   if (index === -1) return new Response(null, { status: 404 });

//   return new Response(null, { status: 204 });
// };
