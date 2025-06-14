// สร้าง function สำหรับ save file ลงบยเครื่องของเรา

import { mkdir, rm, unlink, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export const saveFile = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const folderName = crypto.randomUUID(); // สุ่มชื่อไฟล์
  const fileName = file.name; //ชื่อรูป
  await mkdir(join('public', 'uploads', folderName), { recursive: true });
  const path = join('public', 'uploads', folderName, fileName);

  await writeFile(path, buffer);

  return `${folderName}/${fileName}`;
};

export const removeFile = (path: string) => {
  return unlink(join('public', 'uploads', path));
};

export const removeDirFromFile = (path: string) => {
  const dir = join('public', 'upload', dirname(path));
  return rm(dir, { recursive: true, force: true });
};
