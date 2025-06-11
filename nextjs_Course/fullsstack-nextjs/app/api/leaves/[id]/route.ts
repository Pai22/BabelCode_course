/* eslint-disable prettier/prettier */
import { type UpdateLeaveInput } from '@/features/leaves/types';
import * as api from '@/features/leaves/api';
import * as validators from '@/features/leaves/validators';

interface PathParams {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (_req: Request, { params }: PathParams) => {
  const { id } = await params;
  const leave = await api.findById(+id);

  return Response.json(leave);
};

// Edit data use PATCH
export const PATCH = async (req: Request, { params }: PathParams) => {
  const { id } = await params;
  const body = await (req.json() as Promise<UpdateLeaveInput>);

  try {
    const form = await validators.update.parseAsync(body);
    const leave = await api.update(+id, form);

    return Response.json(leave); //ส่งเป็น status 200
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 422 });
  }
};
