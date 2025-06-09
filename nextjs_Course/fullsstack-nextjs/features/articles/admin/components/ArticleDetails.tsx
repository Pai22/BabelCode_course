import { useGetArticle } from '@/features/articles/admin/hooks/api';
import type * as types from '@/features/articles/types';
import Image from 'next/image';
import { CalendarDays, FileEdit } from 'lucide-react';
import { toDateString } from '@/features/shared/helpers/date';
import { Separator } from '@/components/ui/separator';

interface ArticlesDetailsProps {
  id: types.ArticleDetails['id'];
}

const ArticlesDetails = ({ id }: ArticlesDetailsProps) => {
  const article = useGetArticle(id);

  if (!article) return <div>No article found</div>;
  return (
    <article>
      <figure>
        <div className="relative h-48 w-full object-contain">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(min-width: 800px) 50vw, 100vw"
          ></Image>
        </div>
        {/* <figcaption>{article.image}</figcaption> */}
      </figure>
      <h2 className="my-2 text-center text-xl">{article.title}</h2>
      <Separator></Separator>
      <div className="flex justify-between rounded-sm bg-gray-50 p-2">
        <div className="flex items-center">
          <CalendarDays className="mr-2 w-6" />
          {toDateString(article.createdAt)}
        </div>
        <FileEdit className="w-6" />
      </div>
      <Separator></Separator>
      <p className="my-2 text-gray-600">{article.content}</p>
    </article>
  );
};
export default ArticlesDetails;
