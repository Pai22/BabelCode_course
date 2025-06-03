import { findById } from '@/features/announcements/api';
import AnnouncementDetails from '@/features/announcements/components/AnnouncementDetail';

interface AnnouncementPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AnnouncementPage = async ({ params }: AnnouncementPageProps) => {
  const { id } = await params;
  const announcement = await findById(+id); // ใส่ + เพราะทำให้ string --> number
  return <AnnouncementDetails announcement={announcement} />;
};
export default AnnouncementPage;

//อะไรที่ส่งผ่านจาก url จะเป็น string เสมอ
