import {
  type UpdateLeaveInput,
  type AddLeaveInput,
  type LeaveDatails,
  type LeaveItem,
} from '@/features/leaves/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetLeaves = () => {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: async () => {
      const res = await fetch('/api/leaves');
      const leaves = await (res.json() as Promise<LeaveItem[]>);

      return leaves;
    },
  });
};

export const useGetLeave = (id: LeaveDatails['id']) => {
  return useQuery({
    queryKey: ['leaves', id],
    queryFn: async () => {
      const res = await fetch(`/api/leaves/${id}`);
      const leave = await (res.json() as Promise<LeaveDatails>);

      return leave;
    },
  });
};

export const useCreateLeave = () => {
  return useMutation({
    mutationFn: async (input: AddLeaveInput) => {
      // console.log(input);
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      const leave = await (res.json() as Promise<LeaveDatails>);

      return leave;
    },
  });
};

export const useEditLeave = (id: LeaveDatails['id']) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['leaves', id] });
    },
    mutationFn: async (input: UpdateLeaveInput) => {
      const res = await fetch(`/api/leaves/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      const leave = await (res.json() as Promise<LeaveDatails>);

      return leave;
    },
  });
};
