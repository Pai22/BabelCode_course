import ArticlesDetails from '@/features/articles/admin/components/ArticleDetails';
import { type ArticleItem } from '@/features/articles/types';
import DataGrid, {
  type DataGridColumn,
} from '@/features/ui/components/DataGrid';

interface ArticleListProps {
  articles: ArticleItem[];
}

const ArticleList = ({ articles }: ArticleListProps) => {
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

  return (
    <DataGrid
      title="All Articles"
      columns={columns}
      rows={articles}
      detailsComponent={ArticlesDetails}
    />
  );
};
export default ArticleList;
