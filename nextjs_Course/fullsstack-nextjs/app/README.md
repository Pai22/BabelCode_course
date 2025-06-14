## 📍React Fundamentals

## ไฟล์ `layout.tsx` เป็นไฟล์ที่กำหนดโครงสร้าง layout ของตัว page ของเรา

## 📍การใช้ Fragment

ช่วยจัดการ div ส่วนเกินไม่ให้ div มันบวมขึ้น

1. import Fragment มาใช้

```js
import { Fragment } from 'react';

const HomePage = () => {
  return (
    <Fragment>
      <div>Hello world</div>
      <div>Hello world</div>
      <div>Hello world</div>
    </Fragment>
  );
};
export default HomePage;
```

2. ใช้ root tag `<></>`

```js
const HomePage = () => {
  return (
    <>
      <div>Hello world</div>
      <div>Hello world</div>
      <div>Hello world</div>
    </>
  );
};
export default HomePage;
```

## ส่ง property ไป component

- component ใดๆสามารถมี property ส่งเข้ามาใน function ได้และจะมีรูปแบบเป็น object โดย object ตัวนี้จะมีค่าที่ถูกส่งเข้าไปในตัวมันขึ้นอยู่กับว่าเราส่งอะไรให้กับมัน
- กรณีที่เราส่งของโดยการเสียบของนี้ไว้ตรงกลางระหว่างแท็กเปิดกับแท็กปิดสิ่งนั้นจะกลายไปเป็น property ตัวนึงที่ชื่อว่า Children ดังนั้นเราจึงดึงค่ามาใช้ได้โดยเรียกใช้ props.children หรือสามารถดึง children ออกมาได้เลย และต้องกำหนดชนิดข้อมูลของ children ด้วย

```tsx
import { ReactNode } from 'react';

const Header = () => {
  return (
    <>
      <button>Products</button>
      <button>Articles</button>
    </>
  );
};

const Footer = () => {
  return <footer>Footer</footer>;
};

interface ContentProps {
  children: ReactNode;
}

const Content = ({ children }: ContentProps) => {
  return (
    <>
      <article className="m-4 rounded-sm border border-red-500 p-4">
        {children}
      </article>
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <Header />
      <Content>
        <div>Hello world</div>
        <div>Hello world</div>
        <div>Hello world</div>
      </Content>

      <Footer />
    </>
  );
};
export default HomePage;
```

---

## หลักการใช้งาน react nextJS

แบ่ง component ออกเป็นประเภทใหญ่ๆได้ 2 ประเภท

1. React Server Component
   อะไรก็ตามที่อยู่ภายใต้ Folder `app` จะใช้เป็น react Server Compnent
2. React Client Component
   อะไรก็ตามที่อยู่ภายใต้ Folder `app` แล้วมีการเรียกใช้ useState useEffect ... จะต้องมีการประกาศ `use client` ไว้บนหัวไฟล์นั้นๆ

### ตัวอย่างการ sync ตัว state (TodoApp)

```tsx
'use client';
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Text1' },
    { id: 2, text: 'Text2' },
  ]);

  const [input, setInput] = useState('');

  const addTodo = () => {
    setTodos([{ id: +new Date(), text: input }, ...todos]);
    setInput('');
  };

  return (
    <>
      <input
        type="text"
        onChange={(event) => setInput(event.target.value)}
        value={input} //ใส่ให้มัน sync เพื่อที่จะเซตค่าว่างได้ หมายความว่าถ้าค่า input เปลี่ยน value ข้างในก็จะเปลี่ยนตามไปด้วย
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
};
export default TodoApp;
```

---

## 📍Parent-Child Communication

แยก component ให้ชัดเจน

```tsx
'use client';
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
}

interface TodoFormProps {
  onSubmit: (input: string) => void; // void คือไม่ส่งค่าอะไรกลับมา
}

const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [input, setInput] = useState('');
  const handleSubmit = () => {
    onSubmit(input);
    setInput('');
  };

  return (
    <>
      <input
        type="text"
        onChange={(event) => setInput(event.target.value)}
        value={input}
      />
      <button onClick={handleSubmit}>Add</button>
    </>
  );
};

interface TodoList {
  todos: Todo[];
}
const TodoList = ({ todos }: TodoList) => {
  return (
    <>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </ul>
    </>
  );
};

const TodoItem = ({ text }: Todo) => {
  return <li>{text}</li>;
};

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Text1' },
    { id: 2, text: 'Text2' },
  ]);

  const addTodo = (input: string) => {
    setTodos([{ id: +new Date(), text: input }, ...todos]);
  };

  return (
    <>
      <TodoForm onSubmit={addTodo} />
      <TodoList todos={todos} />
    </>
  );
};
export default TodoApp;
```

---

## 📍useEffect

เป็น function ที่ทำงานบนเว็บ browser เท่านั้นและใ่้ช้คู่กับ useClient

### ตัวอย่างที่ 1 Dependency List

- dependency list ส่งในรูปแบบของ array
- จะบ่งบอกว่าเมื่อมีตัวแปรที่อยู่ภายใต้ dependency list เปลี่ยนแปลง เราจะรัน function ใน useEffect อีกครั้ง
- แต่ถ้าไม่มีตัวแปรจะทำแค่ครั้งเดียว

📘 ตัวอย่างนี้ทำแค่ครั้งเดียวเพราะไม่มีตัวแปรใน dependency list จะทำแค่ตอน Mounted

```tsx
'use client';

import { useEffect, useState } from 'react';

interface FooProps {
  count: number;
}
const Foo = ({ count }: FooProps) => {
  // Mounted ไปปรากฏอยู่บนหน้าจอแล้ว
  useEffect(() => {
    console.log(123456);
  }, []);

  return <div>{count}</div>;
};

const HomePage = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Foo count={count} />
      <button onClick={() => setCount(count + 1)}>Inc</button>
    </>
  );
};
export default HomePage;
```

📘 ตัวอย่างนี้ทำทุกครั้งที่ตัวแปร count เปลี่ยนและจะทำ ตอน Mounted

```tsx
'use client';

import { useEffect, useState } from 'react';

interface FooProps {
  count: number;
  count2: number;
}
const Foo = ({ count, count2 }: FooProps) => {
  // Mounted ไปปรากฏอยู่บนหน้าจอแล้ว
  // Updated เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    console.log(123456);
  }, [count]);

  return (
    <div>
      {count}-{count2}
    </div>
  );
};

const HomePage = () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <>
      <Foo count={count} count2={count2} />
      <button onClick={() => setCount(count + 1)}>Inc</button>
      <button onClick={() => setCount2(count2 + 1)}>Inc 2 </button>
    </>
  );
};
export default HomePage;
```

### ตัวอย่างที่ 2 ทำทุกครั้งตอน render และ unmounting

๊function ใน useEffect ทำงานตอน mounted และเมื่อ component update จะรันfunctionใหม่ทุกครั้ง

```tsx
const Foo = ({ count }: FooProps) => {
  // Mounted ไปปรากฏอยู่บนหน้าจอแล้ว
  // Updated เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    console.log(123456);
  });

  return <div>{count}</div>;
};
```

> หมายเหตุ: ไม่มีตัว Dependency List

📘 ตัวอย่าง unmounting ก่อนที่จะออกจากหน้าจอ
unmounting ทำก่อนที่จะออกจากหน้าจอ เป็นการทำงานส่วนที่ return นี้ และทำก่อนที่ function ข้างบนจะทำ สรุปมีการทำ 2 รอบ

1. ทำตอนตาย
2. ทำก่อนที่จะเกิด function หรือ state เปลี่ยน ตอนที่ทำส่วนนี้จะได้ค่าเดิมของก่อนที่มันจะตาย (cleanup)

```tsx
'use client';

import { useEffect, useState } from 'react';

const Foo = () => {
  // Mounted ไปปรากฏอยู่บนหน้าจอแล้ว
  // Updated เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    console.log('hello');

    // unmounting ทำก่อนที่จะออกจากหน้าจอ เป็นการทำงานส่วนที่ return นี้ และทำก่อนที่ function ข้างบนจะทำ
    //Cleanup
    return () => console.log('Bye');
  }, []);

  return <div>Foo</div>;
};

const HomePage = () => {
  const [hide, setHide] = useState(false);
  return (
    <>
      <button onClick={() => setHide(!hide)}>Toggle</button>
      {!hide && <Foo />}
    </>
  );
};
export default HomePage;
```

ตัวอย่างการ unmounting and cleanup

```tsx
'use client';

import { useEffect, useState } from 'react';

interface FooProps {
  count: number;
}
const Foo = ({ count }: FooProps) => {
  // Mounted ไปปรากฏอยู่บนหน้าจอแล้ว
  // Updated เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    console.log('hello', count);

    // unmounting ทำก่อนที่จะออกจากหน้าจอ เป็นการทำงานส่วนที่ return นี้ และทำก่อนที่ function ข้างบนจะทำ
    //Cleanup
    return () => console.log('Bye', count);
  }, [count]);

  return <div>Foo</div>;
};

const HomePage = () => {
  const [hide, setHide] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Inc</button>
      <button onClick={() => setHide(!hide)}>Toggle</button>
      {!hide && <Foo count={count} />}
    </>
  );
};
export default HomePage;
```

ผลลัพธ์ในการเช็ค

```
hello 0
page.tsx:16 Bye 0
page.tsx:12 hello 1
page.tsx:16 Bye 1
page.tsx:12 hello 2
page.tsx:16 Bye 2
page.tsx:12 hello 3
```

---

## 📍การใช้เครื่องหมาย `=`

1. การใช้ `==`
   เป็นกาเช็คแค่ค่าว่าตรงกันไหม
2. การใช้`===`
   เป็นการเช็คค่าและชนิดข้อมูล

---

## 📍Custom Hooks & mock API

### 👀ทำการ mock API

1. ติดตั้ง pck

```bash
pnpm add -D json-server
```

2. สร้างไฟล์ db.json ในหน้า root

```json
{
  "articles": [
    { "id": 1, "title": "Title#1" },
    { "id": 2, "title": "Title#2" },
    { "id": 3, "title": "Title#3" }
  ]
}
```

3. แก้ไขไฟล์ package.json ในาส่วนของ scripts

```json
"scripts": {
    "api:dev": "json-server --watch db.json --port 5151"
  },
```

4. รัน

```bash
pnpm run api:dev
```

### ทำการดึง API มาแสดงบนหน้าจอ ทำฝั่ง server

ทำอยู่ฝั่ง server จึงสามารถใช้ async ได้เลย

```tsx
interface Article {
  id: number;
  title: string;
}

const ArticlePage = async () => {
  const res = await fetch('http://localhost:5151/articles');
  const articles = await (res.json() as Promise<Article[]>);

  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
};
export default ArticlePage;
```

### render ในส่วนของ client โดยการใช้ useState และ useEffect

```tsx
'use client';

import { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
}

const ArticlePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    const res = await fetch('http://localhost:5151/articles');
    const articles = await (res.json() as Promise<Article[]>);

    //ย้าย state จาก API มาฝั่ง Client
    setArticles(articles);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
};
export default ArticlePage;
```

> หมายเหตุ: ถ้าต้อง fetch ข้อมูลแบบนี้หลายๆหน้าอาจทำให้เสียเวลาเพราะมันมีหลายบรรทัดควรแยกออกมาเป็น function พิเศษ

### function พิเศษ หรือ useFetch()

ถ้าเรามีหลายๆ component ที่ทำการดึงข้อมูลแบบเดียวกันเราควรแยกออกมาเป็น function พิเศษ

- การใช้งานตัว useCallback ครอบทับสิ่งที่มันเกิดขึ้นก็คือ useCallback จะทำการจดจำ หมายความว่า function นี้เขียนไว้ว่าอะไรทำอะไร ดั้งนั้นถ้าเกิด ArticlePage ของเรา render ใหม่ 3-4 รอบเป็นผลให้ useFetch ถูกเรียกอยู่หลายๆครั้ง fetchArticles ก็ยังคงชี้ไปที่ฟังก์ชันเดิมเพราะว่า useCallback จะจำฟังก์ชันเก่าเอาไว้
- แต่เมื่อไหร่ก็ตามในส่วนของ useFetch มีการเปลี่ยน url ส่วนของ useCallback มันจะ monitor URL และเห็นการเปลี่ยนแปลง ผลลัพธ์คือมันจะลบค่าของฟังก์ชันตัวเดิมที่เคยจำเอาไว้ แล้วทำการสร้างฟังก์ชันใหม่ที่มี url ใหม่เปลี่ยนแปลงและจำฟังก์ชันตัวนั้นแทน fetchArticles จึงชี้ไปหาฟังก์ชันใหม่เป็นผลให้ fetchArticles เปลี่ยนแปลงทำให้ useEffect รันใหม่อีกครั้ง
- ถ้าไม่ใช้ useCallback ถ้าเกิด ArticlePage ของเรา render ใหม่ 3-4 รอบเป็นผลให้ useFetch ถูกเรียกอยู่หลายๆครั้ง fetchArticles ก็จะสร้างฟังก์ชันใหม่ทุกครั้ง

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Article {
  id: number;
  title: string;
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);

  const fetchArticles = useCallback(async () => {
    const res = await fetch(url);
    const data = await (res.json() as Promise<T[]>);

    //ย้าย state จาก API มาฝั่ง Client
    setData(data);
  }, [url]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return data;
}

const ArticlePage = () => {
  const articles = useFetch<Article>('http://localhost:5151/articles');
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
};
export default ArticlePage;
```

📚 สรุปถ้าเกิด url เกิดการเปลี่ยนแปลง useCallback จะทำการลบของเดิมแล้วสร้างฟังก์ชนใหม่ จำค่าฟังก์ชันใหม่ fetchArticles จึงชี้ไปหาตัวฟังก์ชันใหม่เปฌ็นผลทำให้ fetchArticles ตัวนี้เปลี่ยนแปลง ทำให้ตัว useEffect รันใหม่อีกครั้ง ตราบใดที่ url ยังคงเหมือนเดิมเราจะรัน fetchArticle แค่ครั้งเดียวเพราะ fetchArticle จะไม่เปลี่ยนเพราะถูกจำไว้โดย useCallback

- ถ้าหากไม่สนใจเลยว่ามันต้องมีการ update url หรือมั่นใจว่าไม่มีการเปลี่ยน url อยู่แล้วเราสามาถลบตัว useCallback

#### น่าใช้กว่าเมื่อไม่มีการเปลี่ยน url

```tsx
'use client';

import { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([]);

  const fetchArticles = async () => {
    const res = await fetch(url);
    const data = await (res.json() as Promise<T[]>);

    //ย้าย state จาก API มาฝั่ง Client
    setData(data);
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ชี้เมาส์ไป  [] คลิก quick Fix เลือก Disable react-hooks/exhaustive-deps for this line

  return data;
}

const ArticlePage = () => {
  const articles = useFetch<Article>('http://localhost:5151/articles');
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
};
export default ArticlePage;
```

> หมายเหตุ: มันจะทำการสร้างฟังก์ชันใหม่แต่ไม่มีอะไรเสียหายเพราะตัว fetchArticles มันรันแค่ครั้งเดียวเนื่องจากว่ามันรันแน่นนอนตอนที่มันไปปรากฏบนหน้าจอคือเข้าสู่าถานะ mounted แล้วเราไม่ได้ทำการอัพเดตค่าของมันเลย

---

## 📍Static and Dynamic Rendering

1. สร้างโฟเดอร์ announcements, articles และ leaves
2. mock api เพิ่มในไฟล์ db.json

```json
{
  "articles": [
    { "id": 1, "title": "Title#1" },
    { "id": 2, "title": "Title#2" },
    { "id": 3, "title": "Title#3" }
  ],
  "announcements": [
    { "id": 1, "title": "Title#1" },
    { "id": 2, "title": "Title#2" },
    { "id": 3, "title": "Title#3" }
  ],
  "leaves": [
    { "id": 1, "reason": "Reason#1" },
    { "id": 2, "reason": "Reason#2" },
    { "id": 3, "reason": "Reason#3" }
  ]
}
```

3. แบ่งการแสดงผลแต่ละหน้า

- announcements
  ทำเป็น SSR (server-side-rendering)
- articles
  ทำเป้ฯ SSG (static-side-generation)
- leaves CSR (client-side-rendering)

4. แยกโฟเดอร์ features
   root/features/announcements/components
   root/features/articles/components
   root/features/leaves/components

### Announcements (SSR)

ทำ api โดยเขียน finAll สามารถทำได้ 2 วิธี

1. ใช้ fetch API เพื่อไปดึงข้อมูลจากตัว API ของเรา
2. บนตัวของ next เองมีฐานข้อมูลที่เชื่อมต่อได้โดยตรง
   ดังนั้นเราอาจจะเลือกเชื่อมต่อกับฐานข้อมูลโดยตรง จึงต้องทำการจำลองข้อมูลก่อนโดยใช้ faker

#### จำลองข้อมูลโดยใช้ faker

จำลองเหมือนกับเราเชื่อมกับฐานข้อมูลโดยตรง ไม่ผ่าน API

ติดตั้ง package

```bash
   pnpm add -D @faker-js/faker
```

File: /features/announcements/api.ts จำลอง api

```ts
import { faker } from '@faker-js/faker';

export const findAll = () => {
  const length = faker.helpers.rangeToNumber({ min: 3, max: 10 }); // จำลองความยาวของ announcements
  const announcements = Array.from({ length }).map(() => ({
    id: faker.number.int(), // จำนวนเต็ม
    title: faker.lorem.sentence(), // gxHoxitFp8
  }));

  return Promise.resolve(announcements); // ต้องใส่ Promise เพราะตัว nodejs retun เป็น Promise มันจะคืนค่า announcements โดยตรงเมื่อมัน await เสร็จเรียบร้อยแล้ว
  //การเชื่อมต่อกับฐานข้อมูลที่มีแนวโน้มจะใช้เวลานานๆมันจะคืนค่าเป็น promise
};
```

ประกาศชนิดข้อมูล

1. ประกาศตรงๆ
2. ทำให้ sync กับข้อมูลของ api

File: /features/announcements/components/AnnouncementList.tsx

```tsx
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
```

File: /app/announcements/page.tsx

```tsx
// ไฟล์นี้ทำเป็น ssr คือ server component จึงสามารถใช้ async กับ component ได้

import { findAll } from '@/features/announcements/api';
import AnnouncementList from '@/features/announcements/components/AnnouncementList';

const AnnouncementsPage = async () => {
  const announcements = await findAll();
  return <AnnouncementList announcements={announcements} />;
};
export default AnnouncementsPage;
```

สรุป การเขียนโค้ดโดยการดึงข้อมูลผ่านตัว server component มันจะทำเป็น static side generation แม้ตอนที่เป็น dev เราจะเห็นมันรัน function นี้ใหม่ทุกครั้งแต่ตอนกระบวนการของการ build แล้วมันจะ build ออกมาเป็นไฟล์ของ html ตัวเดียวแล้วเซิร์ฟคือคืนไฟล์ตัวเนี้ยออกไปทุกครั้งของการเรียก (มันเป็น static ) ปกติทุกครั้งที่ request เข้ามามันควรจะได้ข้อมูลใหม่ทางฝั่ง server เสอมไม่ใช่เก็บเป็น static

### 🥊แก้ไขโค้ดให้เป็น server side rendering แบบ dynamic

คือทำทุกครั้งที่มี request มาจะต้องรันมันใหม่ทุกครั้งทางฝั่ง server เพื่อ build html ก่อนจะส่งกลับมาที่ client โดยทำให้มันเป็น `Dynamic`

```tsx
// ไฟล์นี้ทำเป็น ssr คือ server component จึงสามารถใช้ async กับ component ได้

import { findAll } from '@/features/announcements/api';
import AnnouncementList from '@/features/announcements/components/AnnouncementList';

const AnnouncementsPage = async () => {
  const announcements = await findAll();
  return <AnnouncementList announcements={announcements} />;
};
export default AnnouncementsPage;

export const dynamic = 'force-dynamic'; // ฝั่ง build จะเป็น ssr แบบ dynamic
```

### Articles

ทำคล้ายๆ announcement แต่ไม่ทำเป็น dynamic ทำเป็น isr แทน

File: /features/articles/components/articleList.tsx

```tsx
import { type findAll } from '@/features/articles/api';

interface ArticleListProps {
  articles: Awaited<ReturnType<typeof findAll>>;
}

const ArticleList = ({ articles }: ArticleListProps) => {
  return (
    <ul>
      {articles.map((articles) => (
        <li key={articles.id}>{articles.title}</li>
      ))}
    </ul>
  );
};
export default ArticleList;
```

File: /features/articles/api.ts จำลอง api

```tsx
import { faker } from '@faker-js/faker';

export const findAll = () => {
  const length = faker.helpers.rangeToNumber({ min: 3, max: 10 });
  const articles = Array.from({ length }).map(() => ({
    id: faker.number.int(),
    title: faker.lorem.sentence(),
  }));

  return Promise.resolve(articles);
};
```

File: /app/articles/page.tsx

```tsx
// ไฟล์นี้ทำเป็น ssg คือ generate html ให้เรียบร้อยตั้งแต่ build
// ssg --> isr
import { findAll } from '@/features/articles/api';
import ArticleList from '@/features/articles/components/ArticleList';

const ArticlesPage = async () => {
  const articles = await findAll();

  return <ArticleList articles={articles} />;
};

export default ArticlesPage;

export const revalidate = 15; // isr
// generate ใหม่ทุกๆ 15 วินาที ในการคืนผลลัพธ์นั้นเมื่อครบ 15 วินาทีแล้ว
// คนแรกที่ requset หลังจาก 15 วิจะยังคงได้ข้อมูลชุดเก่าอยู่พร้อมกับ build ใหม่
// คนที่สอง request มาจะได้ข้อมูลชุดใหม่
```

generate ใหม่ทุกๆ 15 วินาที ในการคืนผลลัพธ์ เมื่อครบ 15 วินาทีแล้ว คนแรกที่ requset หลังจาก 15 วิจะยังคงได้ข้อมูลชุดเก่าอยู่พร้อมกับ build ใหม่ คนที่สอง request มาจะได้ข้อมูลชุดใหม่

---

## 📍Fetch-based Rendering

ใช้ fetch api ในการดึงข้อมูล

### Announcements

1. ทำการสร้าง pass /app/announcements/[id]/page.tsx

```tsx
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
```

2. เพิ่ม function findById ในไฟล์ /features/announcements/api.ts

```tsx
export const findById = async (id: Announcement['id']) => {
  const res = await fetch(`http://localhost:5151/announcements/${id}`, {
    cache: 'no-store', // 'no-store' is ไม่ต้องจดจำค่าไว้ใน cache
  });
  // ใส่ cache ทำให้เกิดการทำงานแบบ ssr
  return res.json() as Promise<Announcement>;
};
```

3. สร้างไฟล์ /features/announcements/components/AnnoucementDetail.tsx

```tsx
import { type Announcement } from '@/features/announcements/types';

interface AnnouncementDetailsProps {
  announcement: Announcement;
}
const AnnouncementDetails = ({ announcement }: AnnouncementDetailsProps) => {
  return <div>{announcement.title}</div>;
};
export default AnnouncementDetails;
```

### Articles

ทำคล้ายๆ Announcements แต่ทำเป็น ssg --> revalidate(isr)

1. ทำการสร้าง pass /app/articles/[id]/page.tsx

```tsx
import { findById } from '@/features/articles/api';
import ArticleDetail from '@/features/articles/components/ArticleDetail';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}
// ตอนมัน build ต้องให้มันเตรียมผลลัพธ์ของ article ที่มี id เป็น 1 หรือ id ที่ต้องการจะเตรียม
export const generateStaticParams = () => {
  return [{ id: '1' }, { id: '2' }];
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { id } = await params;
  const article = await findById(+id);

  return <ArticleDetail article={article} />;
};
export default ArticlePage;
```

2. เพิ่ม function findById ในไฟล์ /features/articles/api.ts

```tsx
export const findById = async (id: Article['id']) => {
  const res = await fetch(`http://localhost:5151/announcements/${id}`, {
    next: { revalidate: 15 }, // ทำ ssg + validate = isr
  });

  return res.json() as Promise<Article>;
};
```

3. สร้างไฟล์ /features/articles/components/ArticleDetail.tsx

```tsx
import { type Article } from '@/features/articles/types';

interface ArticleDetailProps {
  article: Article;
}
const ArticleDetail = ({ article }: ArticleDetailProps) => {
  return <div>{article.title}</div>;
};
export default ArticleDetail;
```

---

## 📍nextjs api

สร้างโฟเดอร์และไฟล์ /app/articles/route.ts

1. วิธีแรกในการส่ง response

```ts
export const GET = () => {
  const articles = [{ id: 1 }, { id: 2 }];
  return Response.json(articles);
};
```

2. วิธีที่สองในการส่ง response
   - การ new response จะทำให้เราสามารถ ส่งข้อมูลกลับไปได้พร้อมกับสามารถเขียน response status ที่เป็น http status กลับไปได้
   - สามารถดีไซน์ตามหลักของ RESTFUL API ได้เลย

```ts
export const GET = () => {
  const articles = [{ id: 1 }, { id: 2 }];
  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### 👀recap RESTFUL API

มีข้อมูลอยู่ทางฝั่งของ server คือ api ของเราแล้วเราเอาข้อมู transfer มาสู่ฝั่งของ client

- ถ้าเว็บของเรามีในส่วนสถาปัตยกรรมแบบ client กับ server สิ่งแรกที่ต้องเตรียมเลยคือทรัพยากรหรือ resource

http method (ส่งไปยัง server)

- GET: เข้าถึงทรัพยากรเพื่อที่จะดึงข้อมูลออกมา
- POST: แปลว่า create
- PUT: ถ้าเราต้องการ replace แปลว่าแทนที่ข้อมูลเดิมที่มีอยู่ฝั่ง server
- PATCH: update ข้อมูลบางส่วน
- DELETE: ลบ

MIME-types (ส่งกลับไปหา client)

- HTML
- XML
- JSON

HTTP status codes
| Code | Status |
|------|---------------------------|
| 1xx | Informational responses |
| 2xx | Success |
| 3xx | Redirection |
| 4xx | Client Errors |
| 5xx | Server Errors |

### 🥊validators (ผู้ตรวจสอบ): Zod

ติดตั้ง package Zod

```bash
pnpm add zod
```

ตัวอย่างการใช้ Zod

```ts
{
  name: 'shomchai',
  gender: 'male',
  age: 24,
  email: 'shomchai@gmail.com',
  password: '12345678'
}

z.object({
  name: z.string(), // ถ้าใส่ .option() ไปด้วยก็จะเป็นการบอกว่า name มีหรือไม่ก็ไม่มีก็ได้
  gender: z.enum(['male', 'female']), //enum คือทางเลือก
  age: z.number().min(1), // min ใช้กับ number แปลว่าค่าต้องไม่น้อยกว่า 1
  email: z.string().email(),
  password: z.string().min(8)// min ใช้กับ string แปลว่าตัวอักษรต้องไม่น้อยกว่า 8 ตัว
})
```

zod จะมีอีกสิ่งนึงที่เรียกว่า inference คือดูว่ากฎของการ validate เป็นอย่างไรมันจะทำการ generate ชนิดข้อมูลของ type script ออกมาให้อัตโนมัติ

---

## 21. Client-Side Rendering (leaves)

ไปถึง client ก่อนแล้วค่อยทำการดึงข้อมูล
// ssg --> CSR

---

## 22. Next Navigation

Next Navigation เป็น package ที่รวบรวม Hooks หลายๆตัวเข้าด้วยกัน สามารถใช้กับ client component

### การเปลี่ยนหน้าจอ

- เมื่อเข้ามาอยู่หน้า Home("/") แล้วต้องการให้มัน redirect เพื่อเปลี่ยนเส้นทางไปที่อื่น มีวิธีการ config ดังนี้
- ไปยังไฟล์ `next.config.mjs`

### ตัวอย่างการ config

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
  redirects() {
    return [
      {
        source: '/',
        destination: '/leaves',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

> ถ้าเป็น true permanent เป็น path ถาวร แปลว่าวิ่งมาที่ ("/") เมื่อไหร่ปุปมันจะวิ่งไปที่ ("/leaves") ทันทีแบบถาวร
> ถ้าเป็น false แปลว่า temporary แปลว่าเปลี่ยน path แค่ชั่วคราว

### Next Navigation: useRouter

- ทำให้เราสามารถเปลี่ยน path บนหน้าจอได้ คล้ายๆกับการใช้ Link component แต่ต่างกันตรงที่ Link component สามารถใช้ได้ทั้ง client และ server component

มี stack ดังต่อไปนี้

1. push: `router.push('/article/1')` จากเดิมอยู่ที่ตำแหน่ง `/articles` เมื่อมีการคลิกมันจะ push `/article/1` เพิ่มเข้าไปแล้วพอกดย้อนกลับก็จะกลับไปหน้าเดิมได้ `/articles`

2. replace: `router.replace('/leaves')` จากที่ push แล้วอยู่ที่ตำแหน่ง `/articles/1` เมื่อมีการคลิกมันจะถูกแทนที่ด้วย `/leaves` ทันทีแล้วกดย้อนกลับจะไป `/articles` เลย จะไม่กลับไป `/articles/1` เพราะถูกแทนที่ด้วย `/leaves` ไปแล้ว ใช้ในกรณีหน้า login

3. back: `router.back()` คือการย้อนกลับจากที่ replace ไป `/leaves` แล้วกด back มันจะกลับไปหน้า `/articles`

📚 ตัวอย่างโค้ด

```tsx
'use client';

import { type findAll } from '@/features/articles/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ArticleListProps {
  articles: Awaited<ReturnType<typeof findAll>>;
  // RetrunType คือ เข้าถึงสิ่งที่คืนออกมาจากฟังก์ชันก่อน
  //ของที่มันคืนออกมาติด promise จึงต้องใส่ await เพื่อให้เอาแต่ใส่ใน
  //จะได้ articles ที่ sync กับ api แล้ว
}

const ArticleList = ({ articles }: ArticleListProps) => {
  const router = useRouter();

  return (
    <>
      <ul>
        {articles.map((articles) => (
          <li key={articles.id}>
            <Link href={`/articles/${articles.id}`}>{articles.title}</Link>
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push('/leaves')}
        className="bg-green-700 text-white"
      >
        Navigate to /leaves
      </button>
      <button
        onClick={() => router.replace('/leaves')}
        className="bg-red-700 text-white"
      >
        Navigate to /leaves
      </button>
      <button
        onClick={() => router.back()}
        className="bg-yellow-300 text-white"
      >
        Navigate to /leaves
      </button>
    </>
  );
};
export default ArticleList;
```

### Next Navigation: usePathname

สามารถดึงค่าของตัว path name ออกจาก url ได้
ตัวอย่าง
`https://babelcoder.com/articles/fullstack-nextjs` --> `/articles/fullstack-nextjs`

📚 ตัวอย่างโค้ด

```tsx
'use client';

import { type findAll } from '@/features/articles/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ArticleListProps {
  articles: Awaited<ReturnType<typeof findAll>>;
}

const ArticleList = ({ articles }: ArticleListProps) => {
  const pathname = usePathname();
  console.log('pathname', pathname);

  return (
    <>
      <ul>
        {articles.map((articles) => (
          <li key={articles.id}>
            <Link href={`/articles/${articles.id}`}>{articles.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
export default ArticleList;
```

### Next Navigation: useSearchParams

สามารถดึงค่าของ query string ที่อยู่ภายใต้ url ของเราออกมาได้
ตัวอย่าง
`https://babelcoder.com/articles?category=programming` -->get('category') `programming`

📚 ตัวอย่างโค้ด

```tsx
'use client';

import { type findAll } from '@/features/articles/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ArticleListProps {
  articles: Awaited<ReturnType<typeof findAll>>;
}

const ArticleList = ({ articles }: ArticleListProps) => {
  const search = useSearchParams();
  console.log('searchparams = ', search.get('category'));
  //URL: http://localhost:3000/articles?category=food
  //AWS: searchparams = food

  return (
    <>
      <ul>
        {articles.map((articles) => (
          <li key={articles.id}>
            <Link href={`/articles/${articles.id}`}>{articles.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
export default ArticleList;
```

### Next Navigation: useParams

/app/articles/[id] อยากทราบว่า id ของ url นี้คืออะไรสามารถใช้ useParams ได้
ตัวอย่าง
`https://babelcoder.com/articles/123` --> `123`

📚 ตัวอย่างโค้ด

```tsx
'use client';

import { type Article } from '@/features/articles/types';

import { useParams } from 'next/navigation';

interface ArticleDetailProps {
  article: Article;
  onUpdate: (id: Article['id']) => void;
}

const ArticleDetail = ({ article, onUpdate }: ArticleDetailProps) => {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  return (
    <div>
      {article.title}
      <button
        onClick={() => onUpdate(article.id)}
        className="bg-amber-800 text-white"
      >
        Update
      </button>
    </div>
  );
};
export default ArticleDetail;
```

---

## 📍23. Prisma ORM

- Prisma เป็นเครื่องมือประเภท ORM (Object-Relational Mapping) ที่ช่วยให้เราสามารถออกแบบ Model สร้าง Schema และทำ Database Migration ได้อย่างง่ายได้ เพื่อให้เราสามารถใช้งาน Prisma ได้ ให้ทำการติดตั้ง Prisma ก่อนผ่านคำสั่งคือ
- ORM (object relational mapping) เป็นกลุ่มเครื่องมือที่จะออกแบบตัวโมเดลของเราได้ โดยโมเดลนี้จะเป็นตัวแทนของข้อมูลซึ่งมาจาก Table ในฐานข้อมูลของเราและเราสามารถเชื่อมต่อผ่าน orm เหล่านี้เพื่อเข้าถึงไปแก้ไข ไปสร้าง หรือว่าลบข้อมูลในฐานข้อมูลอีกทีนึง ORM ที่เป็นที่นิยมของ js คือ `Prisma`
- การใช้งานตัว `Prisma` เราจะทำการนิยามสิ่งนึงที่เรียกว่าเป็นโมเดล โดยโมเดลจะเป็นตัวแทนของ Table เมื่อเราออกคำสั่ง `prisma generate` มันจะไปสร้างไฟล์สำหรับชนิดข้อมูล

ติดตั้ง package Prisma

```bash
pnpm add -D prisma
```

Prisma นั้นจะมีไฟล์พิเศษชื่อ `prisma/schema.prisma `สำหรับนิยาม Model เพื่อเป็นตัวแทนของ ตารางต่าง ๆ ในฐานข้อมูล โดยการใช้งาน ORM นั้นต้องทำการระบุว่าจะเชื่อมต่อการทำงานบนฐานข้อมูลใด ในที่นี้เราจะใช้ PostgreSQL

ทำการสร้างไฟล์ `prisma/schema.prisma` พร้อมระบุฐานข้อมูลเป็น postgresql ดังนี้โดยใช้คำสั่งนี้

```bash
pnpx prisma init --datasource-provider postgresql
```

จากคำสั่งดังกล่าวจะเกิดโฟลเดอร์ชื่อ `prisma` ที่ภายในมีไฟล์คือ `schema.prisma` อยู่ เราสามารถสร้าง Model และผูกความสัมพันธ์ระหว่าง Model ได้ในไฟล์นี้

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

ไฟล์ที่ถูกสร้างโดย Prisma นี้จะทำการเชื่อมต่อไปยังฐานข้อมูลโดยอาศัย DSN ผ่านค่า Environment Variable ในชื่อของ `DATABASE_URL`

### เตรียมฐานข้อมูลด้วย Docker Compose

เราจะทำการรัน PostgreSQL ผ่าน Docker Compose โดยให้ทำการสร้างไฟล์ `docker-compose.yml` ดังนี้

```yml
version: '3.9'
services:
  db:
    image: 'postgres:15.3-alpine3.18'
    ports:
      - '9111:5432'
    environment:
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: mypassword
```

เราออกคำสั่งสำหรับการรันฐานข้อมูลดังกล่าวด้วยคำสั่ง bash นี้เท่านั้น

```bash
docker compose up
```

คำสั่งดังกล่าวจะเปิดการเชื่อมต่อไปยังฐานข้อมูลที่พอร์ต 9111 โดยมีชื่อและรหัสผ่านการเข้าใช้งานเป็น myapp และ mypassword ตามลำดับ ด้วยเหตุนี้เมื่อกำหนดชื่อฐานข้อมูลเป็น `fullstack-nextjs` ทำให้ DSN ของเราได้เป็น

```.env
DATABASE_URL="postgresql://myapp:mypassword@localhost:9111/fullstack-nextjs?schema=public"
```

นำค่านี้ไประบุในไฟล์ `.env` โดยใช้ชื่อตัวแปร `DATABASE_URL` ดังนี้

### Schema

กำหนดข้อมูล model ผ่านไฟล์ `prisma/schema.prisma` ดังนี้

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MANAGER
  MEMBER
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  id            Int            @id @default(autoincrement()) // เพิ่มค่าของ id เราให้อัตโนมัต
  name          String
  email         String         @unique // email ห้ามซ้ำกัน
  image         String? //ใส่ optional"?" เพื่อบอกว่า field ตัวนี้ไม่ได้ require ไม่จำเป็นต้องใส่เข้ามาก็ได้
  role          Role           @default(MANAGER)
  createdAt     DateTime       @default(now()) // เวลาสร้าง record ปุ๊บ create เมื่อไหร่จะกำหนดให้เป็น Date Time ณ ตอนนั้นทันที
  updateAt      DateTime       @default(now())
  leaves        Leave[]
  announcements Announcement[]
  articles      Article[]
  // สามตัวหลังที่เพิ่มเข้ามานั้นจะบ่งบอกว่า leaves, announcements และ articles สามารถเข้าถึง user ได้
}

model Leave {
  id              Int         @id @default(autoincrement())
  status          LeaveStatus @default(PENDING)
  reason          String
  leaveDate       String
  rejectionReason String?
  userId          Int //เป็น foran key ที่ชี้ไปหา user ในส่วนของ id
  createdAt       DateTime    @default(now())
  updateAt        DateTime    @default(now())
  user            User        @relation(fields: [userId], references: [id])

  // leave ของเราเข้าถึง user เวลาจะวิ่งต่อไปที่ user ให้ดูที่ field อะไร ในที่นี้คือ field: userId
  // แล้วเวลาย้อนกลับมาหาตัว leave จะต้องใส ref id ของ leave ด้วย
  // สร้างความสัมพันธ์กับ user เพื่อให้เข้าถึง user ได้
  @@unique([userId, leaveDate]) // user คนเดียวกันจะไม่สามารถกำหนด leaveDate ซำ้กันได้ และต้องใส่ "@@" สองอันเพราะอยู่ข้องนอกไม่ได้ต่อหลังใคร
}

model Announcement {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  excerpt   String
  content   String
  userId    Int
  createdAt DateTime @default(now())
  updateAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Article {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String   @unique
  excerpt   String
  content   String
  image     String
  userId    Int
  createdAt DateTime @default(now())
  updateAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}


```

### การทำ Prototype

คือการขึ้นรูปของตัวโครงสร้าง table อย่างง่ายๆและเห็นผลลัพธ์ทันที โดยใช้คำสั่งนี้

```bash
pnpx prisma db push
```

เสร็จแล้วมันจะมีการสร้าง Generated Prisma Client เป็นตัวที่ทำให้เราสามารถเชื่อมต่อกับฐาข้อมูลของเราโดยตรงได้และมีการ generated ชนิดข้อมูลให้กับเราเรียบร้อย

สามารถเปิดตัว client ขึ้นมาเพื่อดูว่าโครงสร้างของฐานข้อมูลเรามี table อะไรและมีข้อมูลอะไรอยู่บ้าง โดยใช้คำสั่ง

```bash
pnpx prisma studio
```

### ทำการจำลองข้อมูลโดยใช้ faker

- จำลองฐานข้อมูล อะไรที่เกี่ยวข้องกับฐานข้อมูลหรือ network function นั้นจะต้องใส่ async/await
- แล้วเมื่อเป็น async function ตัวมันเองจะคืน Promise

```bash
pnpm add -D @faker-js/faker
```

ตัวอย่างการจำลองข้อมูลในไฟล์ /prisma/seed.ts

```ts
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
```

### ออกคำสั่งรัน seed

1. ต้องติดตั้ง package tsx ก่อนจะทำให้เราสามารถรันไฟล์ตัว typscript โดยตรงได้

```bash
pnpm add -D tsx
```

2. เพิ่มคำสั่งลงในไฟล์ package.json ต่อส่วนของ scripts

```json
  "scripts": {
    "db:seed": "prisma db seed", //รัน prisma ให้สร้างข้อมูล
    "db:push": "prisma db push",
    "db:studio": "prisma studio" //รัน prisma ให้สามารถดูข้อมูลที่สร้างมาได้
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
```

---

## 📍24. Prisma Workflow

### Data Management Workflow สำหรับ Development

การเริ่มต้นพัฒนาโปรแกรมกับฐานข้อมูลเราอาจออกแบบและกำหนด Prototype ของเราก่อนบน Model ของ Prisma จากนั้นจึงให้ Prisma อ่านไฟล์ Schema เพื่อสร้างตารางและเปลี่ยนแปลงโครงสร้างตามที่กำหนด อาศัยคำสั่งต่อไปนี้เราสามารถกำหนดการทำงานดังกล่าวข้างต้นได้

```bash
pnpx prisma db push
```

หากเรามีการแก้ไขไฟล์ Schema โดยทำการเพิ่ม field ที่จำเป็นต้องระบุทุกครั้ง เช่น ทำการเพิ่ม password เข้าไปยัง User

```ts
model User {
  id            Int            @id @default(autoincrement())
  name          String
  password      String
  email         String         @unique
  image         String?
  role          Role           @default(MEMBER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @default(now())
  leaves        Leave[]
  articles      Article[]
  announcements Announcement[]
}
```

กรณีที่ตาราง User มีข้อมูลอยู่ก่อนแล้ว เมื่อออกคำสั่ง `pnpx prisma db push` Prisma จำเป็นต้อง reset ข้อมูลเนื่องจากข้อมูลของ User เดิม ไม่มี password มาก่อน แต่ field password นั้นจำเป็นต้องมีในทุก record ส่วนนี้ Prisma จะแจ้งเตือนเพื่อให้เราดำเนินการต่อ

```bash
⚠️ We found changes that cannot be executed:

• Added the required column `password` to the `User` table without a default value. There are 2 rows in this table, it is not possible to execute this.

? To apply this step we need to reset the database, do you want to continue? All data will be lost. » (y/N)
```

เมื่อเราทำการสร้างตารางบนฐานข้อมูลเรียบร้อยแล้ว ลำดับถัดไปเราจะเตรียมข้อมูลไว้ในฐานข้อมูลให้เรียบร้อย ข้อมูลส่วนนี้เตรียมไว้เพื่อใช้สำหรับ Development เท่านั้น กระบวนการเตรียมข้อมูลนี้เรียกว่า Database Seeding (ศึกษาข้อมูลเพิ่มเติมในหัวข้อ Database Seeding)

เพื่อให้เราเห็นข้อมูลที่อยู่ในตารางต่าง ๆ Prisma ได้เตรียม Prisma Studio ซึ่งเป็นเครื่องมือสำหรับจัดการข้อมูล บนฐานข้อมูลไว้ให้แล้ว เราสามารถเปิด Prisma Studio ได้ด้วยการออกคำสั่ง

```bash
pnpx prisma studio
```

### Database Migrations

เมื่อ Prototype นั้นได้รับการทดสอบเรียบร้อยแล้ว ให้เราทำการสร้าง script พิเศษสำหรับการสร้างตาราง หรือแก้ไขตารางและข้อมูล script พิเศษนี้จะถูกใช้งานในทุก Environment ไม่ว่าจะเป็น development, test หรือ production เราเรียก script นี้ว่า Migrations (ศึกษาเพิ่มเติมในหัวข้อ Migrations)

เราสามารถสร้าง Migration แรกจาก schema ได้ด้วยการออกคำสั่งคือ

สร้าง migration

```bash
pnpm prisma migrate dev --name (ชื่อ maigrate)
```

กรณีที่เราต้องการ reset ข้อมูลจากฐานข้อมูลของเรา สามารถออกคำสั่งดังต่อไปนี้ได้

```bash
pnpx prisma migrate reset
```

คำสั่งดังกล่าวข้างต้นจะกระทำการตามขั้นตอนต่อไปนี้

1. ลบฐานข้อมูล
2. สร้างฐานข้อมูลใหม่
3. run migrations ทั้งหมดที่มีอยู่
4. กระทำ database seeding

แล้วรันคำสั่งนี้เพื่อเปิด

```bash
pnpm db:studio
```

เพิ่มส่วนของ scripts
เพื่อให้การออกคำสั่งทั้งการ push ข้อมูล และการเปิด Prisma Studio เป็นไปได้โดยง่าย เราจะเพิ่ม scripts เหล่านี้เข้าไปยัง `package.json`

```JSON
{
  "scripts": {
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  }
}
```

เมื่อเราทำการสั่ง migrate ในลักษณะแบบนี้แล้วในครั้งถัดไปควรพยายามสร้าง migrate ทุกครั้ง เช่น
เพิ่มตัว password ในส่วนของ schema ต้องใช้คำสั่ง

```bash
pnpm prisma migrate dev --name add_password_to_user_table --create-only
```

migration จะไม่ถูกสร้างเพราะ db ของเรามี user อยู่แล้วต้องใส่และแต่ละตัวไม่มี password เลยดังนั้นมันถือว่าข้อมูลไม่ consistency จึงต้องใส่ `--create-only` เพิ่มแต่มันจะทำการสร้างตัว migration ให้กับเราก็จริงแต่จะไม่รันให้
เราสามารถไปเขียนในไฟล์ magration เพื่อ update ให้สามารถใส่ password ทีหลังได้โดยเขียน sql และใช้คำสั่ง update migration เพื่อ sync กับตัวอื่นๆ

```bash
pnpx prisma migrate dev
```

ถ้าหากเราขึ้นสู่ production เราจะออกคำสั่งในการรันโหมด production ได้ดังนี้

```bash
pnpx prisma migrate deploy
```

### Migration

คำสั่งต่อไปนี้เป็นคำสั่งที่ถูกใช้เฉพาะบน Development

1. กรณีของการพัฒนาอาจมีการเปลี่ยน schema โดยไม่ต้องการสร้าง Migration ให้ออกคำสั่ง `pnpm prisma db push`
2. กรณีของการสร้าง Migration พร้อมสั่งรันเพื่อให้เกิดผลบนฐานข้อมูลให้ใช้คำสั่ง `pnpm prisma migrate dev --name <ชื่อ migration>`
3. กรณีของการ seed ข้อมูล ให้ใช้คำสั่ง `pnpm prisma db seed`
4. หากต้องการ reset ข้อมูลพร้อมรัน seed ใหม่ให้ใช้คำสั่ง `pnpm prisma migrate reset`

คำสั่งต่อไปนี้ใช้เฉพาะบน Production
`pnpm prisma migrate deploy`

---

## 📍25. Prisma Q & A

- ทุกโมเดลที่จะสร้างต้องใส่อยู่ใน file: schema.prisma เท่านั้น

## 📍26. Connecting API to the Database

### ทำการสร้างไฟล์ /features/shared/db.ts

ระบุให้เราทราบว่าปัจจุบันเรารัน node แบบไหนแบบ development or production

```ts
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn'] // รัน node แบบ development
      : ['error'], // รัน node แบบ production
});
export default prisma;
```

แล้วต่อไปนี้ถ้าเราจะใช้งานก็แค่เรียกตัว prisma มาใช้งาน

### update ตัว api ที่เคยสร้าง

1. `/features/articles/api.ts`
   ทำการลบ api ที่เคยสร้างเพราะจะทำการแยก api ระหว่างคนธรรมดากับ api admin

```tsx
import { faker } from '@faker-js/faker';
import {
  type CreateArticleInput,
  type Article,
  type UpdateArticleInput,
} from '@/features/articles/types';

const length = faker.helpers.rangeToNumber({ min: 3, max: 10 }); // จำลองความยาวของ articles
let articles = Array.from({ length }).map(() => ({
  id: faker.number.int(), // จำนวนเต็ม
  title: faker.lorem.sentence(), // gxHoxitFp8
}));

export const findAll = () => {
  return Promise.resolve(articles);
};

export const findById = async (id: Article['id']) => {
  const article = articles.find((article) => article.id === id); //ใช้ find ในกาวนลูปเช็คว่า article.id ตรงกับ id ที่รับมารึเปล่า

  if (!article) return Promise.resolve(null); //กรณีหา article ไม่เจอ

  return Promise.resolve(article); // ใช้ Promise เพราะต้องการทำให้ฟังก์ชันนี้เป็น Promise ตอนเรียกใช้งานจะได้ await ได้เลย
};

export const create = (form: CreateArticleInput) => {
  const article = {
    id: faker.number.int(),
    ...form,
  };

  articles.push(article);
  return Promise.resolve(article);
};

export const update = async (id: Article['id'], form: UpdateArticleInput) => {
  const article = await findById(id);
  if (!article) return Promise.resolve(null);

  Object.assign(article, form); // แปลเป็น javascript โดยใช้ Object.assign()
  return Promise.resolve(article);
};

export const remove = (id: Article['id']) => {
  const index = articles.findIndex((article) => article.id === id); // findIndex หาว่าข้อมูลนั้นอยู่ในตำแหน่งไหน คืนค่าเป็น index
  const newArticles = [
    ...articles.slice(0, index), //slice ณ ที่นี้คือ เลือกเอาค่าตั้งแต่ตัวแรก จนถึงก่อนหน้า index ที่เราไม่ต้องการ คืนค่าเป็น array
    ...articles.slice(index + 1), // เลือกเอาตั้งแต่หลัง index เป็นต้นไปจนหมด
  ];

  articles = newArticles;
  return Promise.resolve(index); // ถ้าหาข้อมูลไม่เจอ index จะเป็น -1
};
```

โค้ดที่ทำการแก้ใหม่ในไฟล์ `/features/articles/api.ts`

```tsx
import db from '@/features/shared/db'; // คือ prisma

export const findAll = async () => {
  const articles = await db.article.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
    },
    orderBy: {
      updateAt: 'desc',
    },
  });

  return articles;
};

export const findById = async (id: number) => {
  const article = await db.article.findUnique({
    where: { id },
  });

  return article;
};
```

- findAll: findMany คิือการหาหลายๆตัว ถ้าเขียน findMany() แบบนี้จะได้ทั้งหมดออกมาแต่ถ้าเราไม่ต้องการเอาออกมาทั้งหมดตลอดสามารถ select ออกมาได้เพื่อไม่ให้เปลือง Bw
- findAll: desc มาหลังหรือปัจจุบันอยู่บน แต่ถ้า asc มาก่อนอยู่บน

- findById: ทำการค้นหาตัว article ของเรา ค้นหาด้วย id ไอดีมัน unique เลยต้องใช้ findUnique แล้วทำการ where แล้วก็ select แต่ถ้าต้องการคืนทั้งหมดไม่ต้องใส่เลยมันจะคืนให้อยู่แล้ว

ต่อมาทำการสร้าง api admin เพื่อ create update delete ในไฟล์ `/features/articles/admin/api.ts`

```ts
import db from '@/features/shared/db';
import { type z } from 'zod';
import type * as validators from './validators';
import { slugify } from '@/features/shared/helpers/slugify';
import { revalidatePath } from 'next/cache';

export const add = async (input: z.infer<typeof validators.add>) => {
  const article = await db.article.create({
    data: {
      ...input,
      userId: 1, // ใส่ไปก่อนเพราะยังไม่มีระบบ login
      image: 'http://1234.png',
      slug: slugify(input.title),
    },
  });
  revalidatePath('/articles'); //add แล้วให้ไปเพิ่มข้อมูลใหม่

  return article;
};

export const update = async (
  id: number,
  input: z.infer<typeof validators.update>,
) => {
  const article = await db.article.update({
    where: { id },
    data: {
      ...input,
      image: 'http://123456.com',
      userId: 1,
      slug: input.title ? slugify(input.title) : undefined,
    },
  });

  revalidatePath('/articles');
  revalidatePath(`/articles/${id}`);

  return article;
};

export const remove = async (id: number) => {
  const article = await db.article.delete({
    where: { id },
  });

  revalidatePath('/articles');
  revalidatePath(`/articles/${id}`);

  return article;
};
```

2. `/features/announcements/api.ts`

```ts
import db from '@/features/shared/db';

export const findAll = async () => {
  const announcements = await db.announcement.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return announcements;
};

export const findById = async (id: number) => {
  const announcement = await db.announcement.findUnique({
    where: { id },
  });

  if (!announcement) throw new Error('announcement not found'); // announcement มีบางค่าเป็น null เลยต้องเขียน

  return announcement;
};
```

สร้าง typse.ts ให้มันใหม่
เพื่อที่จะไม่ต้องแก้ types หลายอันมันจะ refer ไปถึงไหล์ api ทุกอย่างก็จะแก้อยู่ที่ api ที่เดียวชนิดข้อมูลก็จะ sync กันทั้งโปรเจคเลย
file: /features/articles/types.ts

```ts
import { type findAll, type findById } from '@/features/articles/api';

export type ArticleItem = Awaited<ReturnType<typeof findAll>>[number];

export type ArticleDetails = NonNullable<Awaited<ReturnType<typeof findById>>>;
// NonNullable เอา null ออก
```

file: /features/articles/admin/types.ts

```ts
import { type add, type update } from '@/features/articles/admin/api';

export type AddAritcleInput = Parameters<typeof add>[0];

export type UpdateAritcleInput = Parameters<typeof update>[0];
```

file: /features/announcements/types.ts

```ts
import { type findById, type findAll } from '@/features/announcements/api';

export type AnnouncementItem = Awaited<ReturnType<typeof findAll>>[number];

export type AnnouncementDetails = NonNullable<
  Awaited<ReturnType<typeof findById>>
>;
```

---

## 📍27. Tailwind CSS and Shadcn UI

### การติดตั้ง Shadcn UI

Shadcn UI เป็นไลบรารี่ที่มาพร้อมกับคอมโพแนนท์สำเร็จรูปที่ใช้ประกอบร่างเป็น UI ที่ต้องการได้ เช่น Button Form และ Dialog เป็นต้น คอมโพแนนท์ต่าง ๆ ของ Shadcn UI จะถูกติดตั้งอยู่ภายใต้โปรเจคของเราโดยตรง ด้วยเหตุนี้เราจึงสามารถแก้ไขคอมโพแแนท์ของ Shadcn UI ที่ถูกติดตั้งบนโปรเจคของเราให้เป็นไปตามรูปแบบที่ต้องการได้

ทำการออกคำสั่งต่อไปนี้เพื่อติดตั้ง Shadcn UI พร้อมตอบคำถามตามการตั้งค่าดังแสดงในตัวอย่างนี้

```bash
pnpm dlx shadcn@latest init
```

เนื่องจากเบื้องหลังการทำงานของ Shadcn UI จะใช้ Tailwind CSS เราจะทำการตั้งค่า Tailwind ให้ประมวลผล class ของ CSS ในคอมโพแนนท์ที่อยู่ภายใต้ โฟลเดอร์ `app` และ `features` ด้วยการแก้ไขส่วนของ content ในไฟล์ `tailwind.config.ts` ดังนี้

ลองใช้ `pnpm dlx shadcn@latest add button` จะได้โฟลเดอร์และไฟล์ components/ui/...

### ทำการสร้างไฟล์ tailwind.config.ts

```ts
/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
```

แก้ไขไฟล์ app/layout.tsx ดังนี้

```ts
{
  content: ['./app/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
}
```

### ใช้ font จาก google font

สามารถเซตได้ดังนี้และติดตั้ง cn ในไฟล์ /app/layout.tsx

```tsx
iimport './globals.css';

import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create-next-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}

```

ทดลองทำการติดตั้งคอมโพแนนท์จาก Shadcn UI เช่น button โดยใช้คำสั่งต่อไปนี้

```bash
pnpx shadcn-ui@latest add button
```

### Icon: lucide

ถูกติดตั้งมากับ shadcn: https://lucide.dev/

### Lodash

Lodash เป็น utility fuction ที่มีตัวฟังก์ชันต่างๆให้เราใช้งานและช่วยชีวิตเราให้มันง่ายขึ้นในการ dev

```bash
pnpm add lodash
```

ตัว lodash เขียนด้วยตัว javascrip ล้วนๆ มันจึงไม่รู้เรื่องของชนิดข้อมูลและก็ไม่รู้ส่าตัวเองมีฟังก์ชันอะไรอยู่บ้าง จึงต้องติดตั้งชนิดข้อมูลแยก

```bash
pnpm add -D @types/lodash
```

---

## 📍29. Custom Components

## 📍30. Form

ติดตั้ง package ตัวช่วยในการสร้าง form ตัสช่วยในการใช้ form ให้ง่ายขึ้น

```bash
pnpm add zod react-hook-form @hookform/resolvers

pnpm dlx shadcn@latest add form input textarea
```

ถ้าใช้ตัว cn ในการสร้าง form จะต้องผสานการทำงานควบคู่กับตัว react hook form

<!-- update pnpm
pnpm add -g pnpm -->

## 📍31. Form Data

## 📍32. React Query (Tanstack Query)

CSR
browser จะร้องขอข้อมูลจาก api โดยตรงผ่าน network จึงอาจมีบ้างครั้งที่ทำให้ช้าได้ จึงต้องมี cache มาช่วยในการเก็บข้อมูลไว้นั้นก็คือ Tanstack Query และจะมีการไปดึงข้อมูลมาอัปเดตอยู่ตลอด เช่นเราไม่ได้ใช้งานอยู่บนเว็บนานๆแต่กลับมามันจะ fethc ข้อมูลให้ใหม้่

### ติดตั้ง package

https://tanstack.com/query/latest/docs/framework/react/quick-start

```bash
pnpm add @tanstack/react-query
pnpm add @tanstack/react-query-devtools
```

Tanstack Query มี 2 สิ่งที่สำคัญ

1. query: เป็นการดึงข้อ มูลจาก api
2. mutation: มีการเปลี่ยนค่า update, create และลบข้อมูล ทำให้เกิดผลลัพธ์ในการเปลี่ยนแปลงค่าของแคช

---

## 📍33. Zustand

library ที่เป็น state management ใช้สำหรับ ส่ง state ข้ามไปข้ามมาระหว่าง component เพระามันมี store(ถังข้อมูล) ในการเก็บ state

### การสร้าง store ของ zustand มี 2 วิธี

1. Multiple Store: เป็นการสร้างถังเพื่อเป็นตัวแทนของข้อมูล โดยข้อมูลนี้จะเป็นฟัเจอร์ใดๆก็ตาม 1 ฟีเจอร์ต่อ 1 store
2. Single Store: มี store แค่ตัวเดียว
   โดยจะมีการสร้างถัง(slice)ที่ผูกความสัมพันธ์กับฟีเจอร์ใดๆแล้วค่อยเอาไปประกอบรวมกันเป็น ถังข้อมูลใหญ่(store) แล้วเวลาเรียกใช้ก็จะเรียกใช้ผ่าน store

### install package

```bash
pnpm add zustand immer
```

ไฟล์ที่สร้างจะอยู่ภาใต้ folder ของฟีเจอร์นั้นๆ เช่น `/features/ui/store.ts` or `/features/articles/store.ts`

### Middleware

ใน store สามารถมี middleware ได้ดวย
middleware คือเครื่องมืออื่นๆที่ใช้เพื่อเพิ่มความสามารถให้กับตัว store ของเรา ให้เราสามารถเขียนรูปแบบการ store ได้โดยตรง เช่น immer สามารถเข้าถึงค่าข้อมูลและแก้ไขข้อมูลลงไปบนค่าของ

เช็ค error
`pnpm tsc --noEmit`

---

## 📍34. Authentication(เช็คว่าเป็นใคร)

เกี่ยวกับ register, login and logout โดยใช้ library `Auth.js`

### ทำการเพิ่ม password ไปที่ schema.prisma ของ user

ใช้คำสั่ง `pnpm prisma migrate dev --name add_password_to_user_table --create-only` เป็นคำสั่งสร้าง migration แต่ยังไม่รัน migration

- ไปยังโฟลเดอร์ migrations แล้วเปิดไฟล์ล่าสุด แล้วเขียน create เพิ่ม

```sql
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

UPDATE "User" SET password = uuid_generate_v4();
```

ใช้คำสั่ง `pnpm prisma migrate dev ` ในการรัน migration ตัวนี้
รัน `pnpm db:studio` เพื่อเปิด ก็จะเห็น password แล้ว

- ไปไฟล์ schema.prisma แล้วเอา `?` ตรง password ออกแล้วรัน `pnpm prisma migrate dev --name add_not_null_to_password`

ไปแก้ไฟล์ seed.ts เพื่อให้มี passwored
ติดตั้ง package `pnpm add bcryptjs` และ `pnpm add -D @types/bcryptjs`

<!-- const loginForm = useForm<types.Signin>({
    resolver: zodResolver(validators.signin),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<types.Signup>({
    resolver: zodResolver(validators.signup),
    defaultValues: { email: '', password: '', name: '' },
  });

  const form = kind === 'login' ? loginForm : registerForm; -->

### install `auth`

```bash
pnpm add next-auth
```

- config next auth ให้สามารถใช้งานได้โดยสร้างไฟล์ config

## 📍35. Authorization(ตรวจสอบสิทธิ์)

## 📍 36. Advanced App Router

### parallel rouste

แยก route สำหรับการโหลด articles แบบ parallel แยกกันโหลดกับหน้าหลัก

ประกาศโดยสร้างโฟลเดอร์จะมี `@` นำหน้า

### intercept Route

คือการแสดงผล details เป็น dialog มีการเปลี่ยน path แต่จะไม่แสดงผลเป็น full pages

- ทำการแทรกกลางการแสดงผลของเรา

## 📍37. SEO (search engine optimization)

title บน web browser ต้องใช้คำที่สื่อว่าหน้าจอที่อยู่ตอนนี้คืออะไร จึงต้องมีการเซตค่าเรียหว่า Meta Data สามารถไปเซตอยู่ที่ pages.tsx หรือ layout.tsx ก็ได้

### Thundermole

ทำให้เราสามารถทดสอบตัวเว็บที่รันอยู่ local บนตัวของ social ได้ ทดสอบโดยการออกคำสั่ง `pnpx tunnelmole (port ที่รัน)` มันจะ generate URL ที่สามารถ access จากโลกภายนอก แล้วเอา url นั้นไปเทสกับ facebookdebuger วาง url ไปก็จะเห็นตัวอย่างเว็บของเราตอนเราโพตส์บนเฟส

- robots ดูว่าในแอพมีลิงค์อะไรที่เข้าถึงได้บ้าง
- sitemap

---

## 📍38. React Optimization

Optimization ตัว react ให้มีความสามารถในการปรับปรุงประสิทธิภาพให้ดีขึ้นได้

```jsx
'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
}

interface TodoListProps {
  todos: Todo[];
  prefix: string;
}

interface TodoItemProps {
  todo: Todo;
  prefix: string;
}

interface TodoFormProps {
  onSubmit: (text: string) => void;
}

const TodoList = ({ todos, prefix }: TodoListProps) => {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} prefix={prefix} todo={todo}></TodoItem>
      ))}
    </ul>
  );
};

const TodoItem = ({ prefix, todo }: TodoItemProps) => {
  return (
    <li>
      {prefix}: {todo.text} ({todo.id})
    </li>
  );
};

const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [text, setText] = useState('');
  const handleSubmit = () => {
    onSubmit(text);
    setText('');
  };

  return (
    <>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border"
      />
      <button onClick={handleSubmit}>Add</button>
    </>
  );
};

const TodoListApp = () => {
  const [prefix, setPrefix] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (text: string) => {
    setTodos([...todos, { id: +new Date(), text }]);
  };

  return (
    <>
      <input
        type="text"
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
        className="border"
      />
      <TodoForm onSubmit={addTodo}></TodoForm>
      <TodoList prefix={prefix} todos={todos}></TodoList>
    </>
  );
};

export default TodoListApp;
```

- memo
- useMemo

---

## 📍39. Deployment

ให้ทำการแก้ไขและเตรียมไฟล์ต่าง ๆ ดังนี้ deploy แค่ standalone สำหรับ next js

1. สร้างไฟล์ `Dockerfile`

```Dockerfile
##### DEPENDENCIES

FROM --platform=linux/amd64 node:21.5.0-alpine3.18 AS deps
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
elif [ -f package-lock.json ]; then npm ci; \
elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
else echo "Lockfile not found." && exit 1; \
fi

##### BUILDER

FROM --platform=linux/amd64 node:21.5.0-alpine3.18 AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXTAPP_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN \
if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn db:deploy && yarn build; \
elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run db:deploy && npm run build; \
elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run db:deploy && pnpm run build; \
else echo "Lockfile not found." && exit 1; \
fi

##### RUNNER

FROM --platform=linux/amd64 node:21.5.0-alpine3.18 AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. สร้างไฟล์ `.dockerignore`

```dockerignore
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
.git
public/uploads
```

3. แก้ไขไฟล์ `next.config.mjs` โดยการเพิ่มส่วนของ `output`

```js
await import('./features/shared/env.mjs');

/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone', //✅ เพิ่มบันทัดนี้
  eslint: {
    dirs: ['.'],
  },
  redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
      },
    ],
  },
};

export default config;
```

4. แก้ไข `docker-compose.yml` ดังนี้

```yml
version: '3.9'
services:
  app:
    platform: 'linux/amd64'
    build:
      context: .
      dockerfile: Dockerfile
      network: host
      args:
        NEXT_PUBLIC_CLIENTVAR: 'clientvar'
        DATABASE_URL: 'postgresql://myapp:mypassword@localhost:9111/absence-management?schema=public'
        NEXTAUTH_SECRET: 'p0I0oiZgFGhha0eQKzumB5Awyeqe4hQ2jmaQ4t/HuMk='
        NEXTAUTH_URL: 'http://localhost:3000'
        NEXTAPP_URL: 'http://localhost:3000'
    working_dir: /app
    volumes:
      - ./data/uploads:/app/public/uploads
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: 'postgresql://myapp:mypassword@db:5432/absence-management?schema=public'
    depends_on:
      - db
  db:
    image: 'postgres:15.3-alpine3.18'
    ports:
      - '9111:5432'
    environment:
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: mypassword
    volumes:
      - ./data/pg:/var/lib/postgresql/data
```

5. เพิ่มบรรทัดต่อไปนี้ไปยัง `.gitignore`

```
# Docker Data
data
```

6. เพิ่มส่วนของ script `db:deploy` ไปยัง `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix",
    "db:seed": "prisma db seed",
    "db:push": "prisma db push",
    "db:deploy": "prisma migrate deploy" //✅ เพิ่มบันทัดนี้
  }
}
```

7. เนื่องจาก Next.js จะไม่ทำการ serve ส่วนของโฟลเดอร์ public ตอน runtime (เราต้องเตรียมข้อมูลในโฟลเดอร์ public ให้เรียบร้อยตั้งแต่ตอน build time) นั่นทำให้โฟลเดอร์ `uploads` ของเราไม่สามารถเข้าถึงได้จาก URL โดยตรงหากการอัพโหลดนั้นเกิดขึ้นหลัง build เราจะแก้ไขปัญหานี้ด้วยการสร้าง API ที่พาธคือ `/api/uploads` ให้ทำการสร้างไฟล์ `app/api/uploads/[...path]/route.ts` ดังนี้

```ts
import { readFile } from 'fs/promises';

interface Params {
  params: {
    path: string[];
  };
}

export const GET = async (req: Request, { params: { path } }: Params) => {
  const publicDir = __dirname.split('.next')[0] + 'public/uploads/';
  const fileUrl = path.join('/');
  const file = await readFile(`${publicDir}${fileUrl}`);

  return new Response(file);
};
```

ทำการแก้ไข `features/shared/helpers/upload.ts` เพื่อให้ใช้งาน API ดังกล่าว

```ts
import z from 'zod';

export function getImagePath(file: string): string;
export function getImagePath(file?: null): undefined;
export function getImagePath(file?: string | null) {
  if (!file) return;

  try {
    z.string().url().parse(file);
    return file;
  } catch {
    return `/api/uploads/${file}`;
  }
}
```

8. รันส่วนของ db ขึ้นมาก่อนด้วยคำสั่ง `docker compose up db`
   ถ้าต้องการสร้างใหม่ให้ลบตัวเก่าออกก่อนโดยใช้คำสั่ง `docker compose rm db` เสร็จแล้วลบไฟล์ data ออกแล้วออก คำสั่ง `docker compose up db` ใหม่

9. รันส่วนของ app ขึ้นมาด้วยคำสั่ง `docker compose up app`

10. ทดลองทำการใช้งาน
