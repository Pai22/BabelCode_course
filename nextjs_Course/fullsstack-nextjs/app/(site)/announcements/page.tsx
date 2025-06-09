// ไฟล์นี้ทำเป็น ssr คือ server component จึงสามารถใช้ async กับ component ได้

import { findAll } from '@/features/announcements/api';
import AnnouncementList from '@/features/announcements/components/AnnouncementList';

const AnnouncementsPage = async () => {
  const announcements = await findAll();
  return <AnnouncementList announcements={announcements} />;
};
export default AnnouncementsPage;

export const dynamic = 'force-dynamic'; // ฝั่ง build จะเป็น ssr แบบ dynamic
