import {
  type LeaveStatus,
  type Prisma,
  PrismaClient,
} from '@/app/generated/prisma';
import { slugify } from '@/features/shared/helpers/slugify';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  //Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@babelcoder.com' },
    update: {},
    create: {
      email: 'admin@babelcoder.com',
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  //upsert = insert + update แปลว่าถ้ามันไม่เจอข้อมูลมาก่อนมันก็จะทำการสร้างแล้วใส่ไปในฐานข้อมูล
  // แต่ถ้าข้อมูลมีอยู่แล้วมันก็จะทำการ update

  // Create Users
  const numsOfUsers = 10;
  const userIds: number[] = [admin.id];
  const adminIds: number[] = [admin.id];

  for (let i = 0; i < numsOfUsers; i++) {
    const createUserInput: Prisma.UserCreateInput = {
      name: faker.internet.displayName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['ADMIN', 'MANAGER', 'MEMBER']),

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      // image: faker.internet.avatar(),
      image: faker.image.avatar(),
    };

    const user = await prisma.user.upsert({
      where: { email: createUserInput.email },
      update: {},
      create: createUserInput,
    });

    userIds.push(user.id); // ใน list ของ userId ก็จะมี user คนใหม่ที่เราเพิ่งสร้าง
    if (user.role !== 'MEMBER') adminIds.push(user.id);
  }

  // Create Leaves
  const numOfLeaves = 100;

  for (let i = 0; i < numOfLeaves; i++) {
    const status: LeaveStatus = faker.helpers.arrayElement([
      'PENDING',
      'APPROVED',
      'REJECTED',
    ]);
    const userId = faker.helpers.arrayElement(userIds);
    const leaveDate = faker.date.future().toISOString();
    const createLeaveInput: Prisma.LeaveCreateInput = {
      leaveDate,
      reason: faker.lorem.paragraph(),
      user: { connect: { id: userId } },
      status,
      rejectionReason:
        status === 'REJECTED' ? faker.lorem.paragraph() : undefined,
    };
    // ค้นหาโดยใช้ where ใช้ตัวที่เป็น unique
    await prisma.leave.upsert({
      where: {
        userId_leaveDate: {
          userId,
          leaveDate,
        },
      },
      update: {},
      create: createLeaveInput,
    });
  }

  //Create Aricles
  const numOfArticles = 100;

  for (let i = 0; i < numOfArticles; i++) {
    const title = faker.lorem.sentence();
    const createArticleInput: Prisma.ArticleCreateInput = {
      title,
      slug: slugify(title),
      excerpt: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 10 }),
      image: faker.image.url(),
      user: { connect: { id: faker.helpers.arrayElement(userIds) } },
    };

    await prisma.article.upsert({
      where: { slug: createArticleInput.slug },
      update: {},
      create: createArticleInput,
    });
  }

  //Create Announcements
  const numOfAnnouncement = 100;

  for (let i = 0; i < numOfAnnouncement; i++) {
    const title = faker.lorem.sentence();
    const createAnnouncementInput: Prisma.AnnouncementCreateInput = {
      title,
      slug: slugify(title),
      excerpt: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 10 }),
      user: { connect: { id: faker.helpers.arrayElement(userIds) } },
    };

    await prisma.announcement.upsert({
      where: { slug: createAnnouncementInput.slug },
      update: {},
      create: createAnnouncementInput,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1); // บอกว่าถ้ามี error ก็จะ return เป็นเลข 1
  });
