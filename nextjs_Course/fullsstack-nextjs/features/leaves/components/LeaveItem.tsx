import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { statusColor } from '@/features/leaves/helpers/leave-status';
import { type LeaveItem } from '@/features/leaves/types';
import { toDateString } from '@/features/shared/helpers/date';
import { Edit } from 'lucide-react';
import Link from 'next/link';

const LeaveItem = ({ id, reason, status, leaveDate }: LeaveItem) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="font-bold">
        <Link href={`/leaves/${id}`}>{toDateString(leaveDate)}</Link>
      </CardHeader>
      <CardContent>{reason}</CardContent>
      <Separator></Separator>
      <CardFooter className="flex items-center justify-between px-6 py-4">
        <Badge className={statusColor(status)}>{status}</Badge>
        <Link href={`/leaves/${id}/edit`}>
          <Edit className="h-6 w-6"></Edit>
        </Link>
      </CardFooter>
    </Card>
  );
};
export default LeaveItem;
