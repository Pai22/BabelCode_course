'use client';
import { useCreateArticle } from '@/features/articles/hooks/api';

const CreateArticle = () => {
  const { mutateAsync } = useCreateArticle();

  return (
    <button
      className="bg-blue-500 text-white"
      onClick={() => mutateAsync({ title: 'xxx' })}
    >
      Create
    </button>
  );
};
export default CreateArticle;
