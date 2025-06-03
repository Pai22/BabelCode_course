import { type findAll } from '@/features/announcements/api';

interface AnnouncementListProps {
  announcements: Awaited<ReturnType<typeof findAll>>;
  // RetrunType คือ เข้าถึงสิ่งที่คืนออกมาจากฟังก์ชันก่อน
  //ของที่มันคืนออกมาติด promise จึงต้องใส่ await เพื่อให้เอาแต่ใส่ใน
  //จะได้ announcements ที่ sync กับ api แล้ว
}

const AnnouncementList = ({ announcements }: AnnouncementListProps) => {
  return (
    <ul>
      {announcements.map((announcement) => (
        <li key={announcement.id}>{announcement.title}</li>
      ))}
    </ul>
  );
};
export default AnnouncementList;
