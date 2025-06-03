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
