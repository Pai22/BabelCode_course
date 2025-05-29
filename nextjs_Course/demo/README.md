## 📍 Create Project

```cmd
pnpm create next-app@latest
```

> ใช้รูปแบบ App Router

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

> หมายเหตู: การแสดงหน้าแต่ละหน้าต้องอยู่ภายใต้ page.txs เสมอ

## 📍 Install prettier

ตั้งค่า prettier ให้ format

### สร้างโฟเดอร์ .vscode และไฟล์ settings.json

```js
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2
}

```

---

## 📍 การสร้าง API

การสร้าง api บนระบบของ NextJS เราจะไม่ทำการสร้าง `page.tsx` แต่จะสร้าง `route.ts` แทน

> root: app/api/books/route.ts

สำหรับ `route.ts` เมื่อต้องการดักจับ Request ที่ยิงมาด้วย HTTP Methods ใด ให้ทำการสร้างฟังก์ชัน พร้อม `export` ด้วยชื่อของ Method นั้น ในที่นี้ต้องการดักจับ Request ที่มายัง `HTTP GET /api/books` รูปแบบฟังก์ชันภายใต้ `route.ts`

```ts
export const GET = () => {
  const books = [
    { id: 1, title: "Title #1", desc: "Desc #1" },
    { id: 2, title: "Title #2", desc: "Desc #2" },
    { id: 3, title: "Title #3", desc: "Desc #3" },
  ];

  return Response.json(books);
};
```

---

## 📍 install faker

- เป็น package ที่ช่วย generate ใช้สำหรับจำลองข้อมูล
- เวลาเขียนจริงๆจะไม่ทำการเขียนภายใต้ตัว `route` ทั้งหมดอาจมีการแยกย่อยโค้ดไปไว้ที่โฟเดอร์อื่น
- โฟเดอร์อื่นนั้นจะต้องไม่อยู่ภายในโฟเดอร์ `/app` เช่น `/utils/generator.ts`

```cmd
pnpm add @faker-js/faker
```

File: generator.ts
เป็นไฟล์ที่ทำการจำลองข้อมูลสุ่มมา

```js
import { faker } from "@faker-js/faker";

export const generateBooks = () => {
  const length = faker.helpers.rangeToNumber({ min: 3, max: 10 }); // สุ่มตัวเลขออกมา
  const books = Array.from({ length }).map(() => ({
    id: faker.number.int(),
    title: faker.lorem.sentence(),
    desc: faker.lorem.paragraph(),
  }));
  // sentence เป็นประโยค
  // word เป็นคำ
  // paragraph มีหลายประโยค
  return books;
};
```

File: route.ts

```js
import { generateBooks } from "@/utils/generator";

export const GET = () => {
  const books = generateBooks();

  return Response.json(books);
};
```

---

## 📍 วิธีเอา API มา render ข้อมูลมีหลายรูปแบบ

1. ใช้ fetch API ในการดึงข้อมูล โดยสร้างไฟล์ `/utils/api.ts`
   เป็น function ที่เราจะดึงข้อมูล api ที่เราสร้างเอาไว้ใน `/api/books`
   > File: api.ts

```js
import { Book } from "./types";

export const getBooks = async () => {
  const res = await fetch("http://localhost:3000/api/books"); //มีการรอผลลัพธ์ก่อนถึงจะประมวลผลลัพธ์บรรทัดถัดไปจึงต้องใช้ async/awiat

  return res.json() as Promise<Book[]>;
};
// ต้องมีการประกาศโครงสร้างของ Books ที่ไฟล์ /utils/types.ts

```

> File: types.ts

```js
// ใช้ประกาศโครงสร้างข้อมูลที่ใช้ในโปรเจกต์

export interface Book {
  id: number;
  title: string;
  desc: string;
}
```

แล้วสร้างไฟล์ `/app/books/ssg/page.tsx`

### กระบวนการทำงานแบบ Static-Site Generation

> File: /utils/api.ts

- ต้องใส่ `cache: "force-cache"` fetch(...) ไปยัง API ฝั่งเซิร์ฟเวอร์ของตัวเอง (/api/books) — ซึ่งจะถูกมองว่าเป็น dynamic request

```js
import { Book } from "./types";

export const getBooks = async (option?: Parameters<typeof fetch>[1]) => {
  const res = await fetch("http://localhost:3000/api/books", option);
  //มีการรอผลลัพธ์ก่อนถึงจะประมวลผลลัพธ์บรรทัดถัดไปจึงต้องใช้ async/awiat

  return res.json() as Promise<Book[]>;
};
// ต้องมีการประกาศโครงสร้างของ Books ที่ไฟล์ /utils/types.ts

```

> File: /app/books/ssg/page.tsx

```js
import { getBooks } from "@/utils/api";

const SsgPage = async () => {
  const books = await getBooks({ cache: "force-cache" });

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};
export default SsgPage;
```

จะพบว่าทุกครั้งของการ Reload หน้านี้จะได้ผลลัพธ์เป็นเช่นเดิมเสมอ และเป็นข้อมูล HTML ที่มีการแสดงผลมาจากเซิฟเวอร์เองเลย

### กระบวนการทำงานแบบ Incremental Static Regeneration

SSG นั้นมีข้อเสียประการหนึ่งคือแม้ API จะมีข้อมูลใหม่แล้วแต่บนหน้าเพจจะยังคงแสดงผลข้อมูลชุดเดิมเสมอ ด้วยเหตุนี้ Next.js จึงเตรียมวิธีการแสดงผลอีกรูปแบบที่เรียกว่า Incremental Static Regeneration (ISR) ที่ทำให้เราสามารถกำหนดได้ว่าทุกกี่วินาทีจะให้ Next.js ทำการร้องขอข้อมูลจาก API แล้วจึงสร้าง HTML เก็บเป็นค่าแคชใหม่อีกครั้ง

วิธีการใช้งาน Fetch API เพื่อให้เกิดผลลัพธ์แบบ ISR นั้น ให้ทำการระบุออปชั่นเป็น `{ next: { revalidate: 100 } }` เมื่อค่าของ revalidate กำหนดเป็นหน่วยวินาที

> File: /utils/api.ts

- ต้องใส่ `cache: "force-cache"` fetch(...) ไปยัง API ฝั่งเซิร์ฟเวอร์ของตัวเอง (/api/books) — ซึ่งจะถูกมองว่าเป็น dynamic request

```js
import { Book } from "./types";

export const getBooks = async (option?: Parameters<typeof fetch>[1]) => {
  const res = await fetch("http://localhost:3000/api/books", option);
  //มีการรอผลลัพธ์ก่อนถึงจะประมวลผลลัพธ์บรรทัดถัดไปจึงต้องใช้ async/awiat

  return res.json() as Promise<Book[]>;
};
// ต้องมีการประกาศโครงสร้างของ Books ที่ไฟล์ /utils/types.ts

```

> File: /app/books/isr/page.tsx

```js
import { getBooks } from "@/utils/api";

const IsrPage = async () => {
  const books = await getBooks({ next: { revalidate: 10 } });

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};
export default IsrPage;
```

จากโค้ดข้างต้นเมื่อเข้าสู่หน้าเพจคือ /books/isr จะได้ข้อมูลหนังสือชุดหนึ่งและทุกครั้งที่ร้องขอข้อมูลด้วยการ Reload หน้าเพจจะได้ข้อมูลชุดเดิมกลับมาเสมอ จนกระทั่งวินาทีที่ 10 มาถึงการร้องขอครั้งถัดไปจึงจะได้ข้อมูลชุดใหม่แสดงผลออกมา

### กระบวนการทำงานแบบ Server-Side Rendering

บางสถานการณ์เราไม่ต้องการให้ Next.js ทำการแคชข้อมูลหน้าเพจบนฝั่งเซิฟเวอร์เลย เพราะข้อมูลนั้นอาจเป็นข้อมูลสำคัญแบบ real-time แต่เรายังต้องการให้ข้อมูลนี้คืนกลับจาก Next.js แบบ HTML กล่าวคือทุกครั้งที่ร้องขอข้อมูลให้ทำการ render ข้อมูลเป็น HTML จากฝั่งเซิฟเวอร์ก่อนส่งกลับมายัง client โดยไม่จำเป็นต้องทำการแคชหน้าเพจไว้ วิธีนี้เราเรียกว่า Server-Side Rendering (SSR)

สำหรับการใช้ Fetch API เพื่อร้องขอข้อมูลนั้นสามารถสร้างการทำงานแบบ SSR ได้ ด้วยการระบุออปชั่นเป็น { cache: 'no-store' }

> เปลี่ยนแค่ไฟล์ /app/books/ssr/page.tsx

```js
import { getBooks } from "@/utils/api";

const SsrPage = async () => {
  const books = await getBooks({ cache: "no-store" });

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};
export default SsrPage;
```

ทุกครั้งที่ร้องขอข้อมูลจะได้ข้อมูลที่แสดงผลไม่เหมือนกัน นั่นแปลว่าทุกครั้งของการร้องขอข้อมูลมีการสร้างชุดข้อมูลใหม่โดยไม่ แคชเก็บไว้บนฝั่งเซิฟเวอร์นั่นเอง

### กระบวนการทำงานแบบ Client-Side Rendering

การทำงานแบบ SSR นั้นเปลืองหน่วยประมวลผลของเซิฟเวอร์ที่ต้องคอย render ข้อมูลเป็น HTML ให้เสมอก่อนส่งกลับมายังฝั่ง client ด้วยเหตุนี้ Next.js จึงมีอีกวิธีหนึ่งที่ช่วยให้การแสดงผลนั้นเกิดขึ้นบนฝั่ง Client เอง เรียกวิธีการนี้ว่า Client-Side Rendering (CSR)

การทำงานแบบ CSR นี้ต้องมีการระบุ `use client` ไว้บนส่วนหัวของไฟล์ก่อน เพื่อบอก Next.js ให้ทราบว่า เรามีการจัดการการแสดงผลส่วนนี้บนฝั่ง Client

> ไม่ render ข้อมูลจากหลังบ้าน
