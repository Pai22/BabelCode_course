'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import ArticlesDetails from '@/features/articles/admin/components/ArticleDetails';
import ArticleForm from '@/features/articles/admin/components/ArticleForm';
import { useCreateArticle } from '@/features/articles/admin/hooks/api';
import { type AddArticleInput } from '@/features/articles/admin/types';
import { type ArticleItem } from '@/features/articles/types';
import DataGrid, {
  type DataGridColumn,
} from '@/features/ui/components/DataGrid';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface ArticleListProps {
  articles: ArticleItem[];
}

const ArticleList = ({ articles }: ArticleListProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useCreateArticle();
  const columns: DataGridColumn<ArticleItem>[] = [
    {
      field: 'title',
      headerName: 'Title',
    },

    {
      field: 'slug',
      headerName: 'Slug',
    },
  ];

  const handleAddArticle = async (article: AddArticleInput) => {
    setOpen(false);
    await mutateAsync(article);
  };

  return (
    <>
      <DataGrid
        title="All Articles"
        columns={columns}
        rows={articles}
        detailsComponent={ArticlesDetails}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed right-10 bottom-10 z-100 flex items-center justify-center rounded-full bg-blue-600 text-white drop-shadow"
          >
            <Plus></Plus>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle />
          <ScrollArea className="max-h-[50vh]">
            <div className="p-4">
              <ArticleForm kind="create" onSubmit={handleAddArticle} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ArticleList;
