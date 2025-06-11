import { type AddLeaveInput } from '@/features/leaves/types';
import * as validators from '@/features/leaves/validators';
import * as api from '@/features/leaves/api';

export const GET = async () => {
  const leaves = await api.findAll();

  return Response.json(leaves);
};

export const POST = async (req: Request) => {
  const body = await (req.json() as Promise<AddLeaveInput>);

  try {
    const form = await validators.add.parseAsync(body);
    const leave = await api.add(form);

    return new Response(JSON.stringify(leave), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 422 });
  }
};
