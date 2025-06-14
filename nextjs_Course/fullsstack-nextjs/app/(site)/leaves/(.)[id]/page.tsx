import CreateLeave from '@/features/leaves/components/CreateLeave';
import LeaveDetails from '@/features/leaves/components/LeaveDetails';
import InterceptDialog from '@/features/ui/components/InterceptDialog';

interface LeaveDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const LeaveDetailsPage = async ({ params }: LeaveDetailsPageProps) => {
  const { id } = await params;
  return (
    <InterceptDialog>
      {id === 'new' ? (
        <CreateLeave></CreateLeave>
      ) : (
        <LeaveDetails></LeaveDetails>
      )}
    </InterceptDialog>
  );
};
export default LeaveDetailsPage;
