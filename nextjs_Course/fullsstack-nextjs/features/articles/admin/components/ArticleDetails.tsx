import {
  useEditArticle,
  useGetArticle,
} from '@/features/articles/admin/hooks/api';
import type * as types from '@/features/articles/types';
import Image from 'next/image';
import { CalendarDays, FileEdit } from 'lucide-react';
import { toDateString } from '@/features/shared/helpers/date';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ArticleForm from '@/features/articles/admin/components/ArticleForm';
import { UpdateAritcleInput } from '@/features/articles/admin/types';
import { getImagePath } from '@/features/shared/helpers/upload';

interface ArticlesDetailsProps {
  id: types.ArticleDetails['id'];
}

const ArticlesDetails = ({ id }: ArticlesDetailsProps) => {
  const article = useGetArticle(id);
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateArticle } = useEditArticle(id);

  if (!article) return <div>No article found</div>;

  const handleUpdateArticle = async (form: UpdateAritcleInput) => {
    setOpen(false);
    await updateArticle(form);
  };

  return (
    <article>
      <figure>
        <div className="relative h-48 w-full object-contain">
          <Image
            src={getImagePath(article.image)}
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <FileEdit className="w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle />
            <ScrollArea className="max-h-[50vh]">
              <div className="p-4">
                <ArticleForm
                  kind="edit"
                  article={article}
                  onSubmit={handleUpdateArticle}
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <Separator></Separator>
      <p className="my-2 text-gray-600">{article.content}</p>
    </article>
  );
};
export default ArticlesDetails;
