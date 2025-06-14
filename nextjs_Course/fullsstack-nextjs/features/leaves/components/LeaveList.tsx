import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LeaveItem from '@/features/leaves/components/LeaveItem';
import type * as types from '@/features/leaves/types';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LeaveListProps {
  leaves: types.LeaveItem[];
}

const LeaveList = ({ leaves }: LeaveListProps) => {
  const router = useRouter();

  return (
    <section>
      <h1 className="my-4 text-center text-4xl font-bold">All Leaves</h1>
      <Separator className="my-4"></Separator>
      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {leaves.map((leave) => (
          <LeaveItem key={leave.id} {...leave}></LeaveItem>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="fixed right-10 bottom-10 z-100 flex items-center justify-center rounded-full bg-blue-600 text-white drop-shadow"
        onClick={() => router.push('/leaves/new')}
      >
        <Plus></Plus>
      </Button>
    </section>
  );
};
export default LeaveList;
