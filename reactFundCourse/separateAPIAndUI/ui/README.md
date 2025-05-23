# React Hooks & API: Example Notebook และการ Install Mui

คู่มือรวบรวมตัวอย่างการใช้งาน React Hook ต่าง ๆ พร้อมการดึงข้อมูลจาก API และการตั้งค่า axios แบบมี config

---

## 📌 useState

ใช้สำหรับจัดการ state ภายใน component

> ไฟล์: App.js

```js
import { useState } from 'react'

export default function App() {
  // const [firstName, setFirstName] = useState('')
  // const [lastName, setLastName] = useState('')
  const [name, setName] = useState({ firstName: '', lastName: '' })

  return (
    <>
      <input
        type="text"
        onChange={(event) =>
          setName({ ...name, firstName: event.target.value })
        }
      />
      <input
        type="text"
        onChange={(event) => setName({ ...name, lastName: event.target.value })}
      />
      <div>{name.firstName}</div>
      <div>{name.lastName}</div>
    </>
  )
}
```

---

## 📌 useEffect

ใช้สำหรับรันคำสั่งเมื่อ component มีการเปลี่ยนแปลง หรือ component ถูกสร้าง / ทำลาย

### 📅 ตัวอย่าง 1: รันทุกครั้งเมื่อ s1 เปลี่ยน

> ไฟล์: App.js

```js
import React, { useEffect, useState } from 'react'

export default function App() {
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')

  useEffect(() => {
    console.log(`Hello ${s1}`)
  }, [s1]) //ถ้ามี , [s1] จะ render ใหม่ทุกครั้งที่ s1 เปลี่ยนแปลง
  // ถ้าไม่มีจะ render ใหม่ทุกครั้งที่มีการเปลี่ยนแปลงใน component นี้

  return (
    <>
      <input type="text" onChange={(event) => setS1(event.target.value)} />
      <input type="text" onChange={(event) => setS2(event.target.value)} />
    </>
  )
}
```

### 🌀 ตัวอย่าง 2: การทำงานเมื่อ component ถูก unmount

> ไฟล์: App.js

```js
import React, { useEffect, useState } from 'react'

function ToggleableComponent() {
  useEffect(() => {
    return () => {
      console.log('Unmounting...')
    } //ก่อนที่ component จะตายหรือโดนบล็อคมันจะมาทำงานในส่วนที่เป็น return ก่อนบออก
  })

  return <div>ToggleableComponent</div>
}

export default function App() {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpened(!isOpened)}>Toggle</button>
      {isOpened && <ToggleableComponent />}
    </>
  )
}
```

---

## 📌 การดึงข้อมูลจาก API Server แล้วแสดงผลบน React

> ไฟล์: PostList.js

```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      const { data } = await axios.get('http://localhost:5001/posts')

      setPosts(data)
      setIsLoading(false)
    }
    fetchPosts()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <ul>
        {posts.map((posts) => (
          <li key={posts.id}>{posts.title}</li>
        ))}
      </ul>
    </>
  )
}
```

---

## ⚙️ การ config ค่า axios เพื่อเรียก API (ต่อจาก การดึงข้อมูลจาก API Server)

> ปรับให้จัดการ API URL ได้ดีขึ้นผ่าน .env file

### ✅ วิธีที่ 1: ตั้งค่า baseURL โดยตรงใน index.js

```js
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:5001'
```

### ⚠️ ปัญหา: ถ้าเปลี่ยน URL ต้องมาแก้ที่โค้ดทุกครั้ง

### ✅ วิธีที่ 2: ใช้ .env สำหรับเก็บค่า config

1. สร้างไฟล์ .env ที่ root ของโปรเจกต์

```
REACT_APP_API_URL=http://localhost:5001
```

2. ใน index.js

```js
import axios from 'axios'
axios.defaults.baseURL = process.env.REACT_APP_API_URL
```

#เรียกใช้ได้โดย:

```js
const { data } = await axios.get('/posts') //(file: PostList.js)
```

3. รีสตาร์ทเซิร์ฟเวอร์ด้วยคำสั่ง:

```bash
npm start
```

or

```bash
yarn start
```

<!-- > ไปที่ไฟล์ index.js แล้ว import axios แล้วเขียนบอก axios ว่าเมื่อไหร่ที่ทำการดึงข้อมูลจาก server แล้ว server อยู่ที่ URL อะไรโดยเขียน:
> axios.defaults.baseURL = 'http://localhost:5001' (file: index.js) แล้ว axios จะรู้เองทันทีว่าจะไปเอา URL จากไหน
> const { data } = await axios.get('/posts') (file: PostList.js)
> แต่จะเห็นได้ว่าในไฟล์ index.js เราเอา URL ไปใส่ตรงๆเลย มันไม่ดีเพราะในอนาคตถ้าต้องแก้ไข URL จะต้องมาแก้ที่ source code โดยตรง
> ควรแยก env ออกมาโดยไปสร้างไฟล์ .env
> REACT_APP_API_URL=http://localhost:5001 (file: .env)
> axios.defaults.baseURL = process.env.REACT_APP_API_URL (file: index.js) เสร็จแล้วต้องรีรัน server ใหม่
> หากมีค่าอื่นๆที่สามารถ config ได้ก็สามารถย้ายไป .env เป็นการทำให้ค่า config อยู่ที่เดียวกัน -->

> ข้อดี: แยก config ออกจากโค้ด ทำให้เปลี่ยน environment ได้ง่าย

---

## 📌 useRef

> ไฟล์: App.js

```js
import React, { useRef } from 'react'

export default function App() {
  const fileRef = useRef(null)
  return (
    <>
      <input type="file" ref={fileRef} style={{ display: 'none' }} />
      <button onClick={() => fileRef.current.click()}>Upload</button>
    </>
  )
}
```

---

## 📌 Custom hooks

สร้าง hooks เองโดยฟังก์ชันจะต้องขึ้นต้องด้วย use และภายในฟังก์ชันจะต้องเรียกใช้งาน hook อย่างน้อย 1 ตัว

> ไฟล์: useFetch.js

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useFetch(url) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const { data } = await axios.get(url)
      setData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [url])

  return {
    data,
    isLoading
  }
}
```

> ไฟล์: PostList.js

```js
import React from 'react'

import useFetch from './useFetch'

export default function PostList() {
  const { data: posts, isLoading } = useFetch('/posts')

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <ul>
        {posts.map((posts) => (
          <li key={posts.id}>{posts.title}</li>
        ))}
      </ul>
    </>
  )
}
```

> ไฟล์: UserList.js

```js
import React from 'react'
import useFetch from './useFetch'

export default function UserList() {
  const { data: users, isLoading } = useFetch('/users')

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </>
  )
}
```

> ไฟล์: db.json

```json
{
  "posts": [
    { "id": 1, "title": "Title#1", "body": "Body#1" },
    { "id": 2, "title": "Title#2", "body": "Body#2" },
    { "id": 3, "title": "Title#3", "body": "Body#3" },
    { "id": 4, "title": "Title#4", "body": "Body#4" },
    { "id": 5, "title": "Title#5", "body": "Body#5" }
  ],
  "users": [
    { "id": 1, "email": "email1@email.com" },
    { "id": 2, "email": "email2@email.com" },
    { "id": 3, "email": "email3@email.com" },
    { "id": 4, "email": "email4@email.com" },
    { "id": 5, "email": "email5@email.com" }
  ]
}
```

---

## 📌 Recap restful API

restful API เป็นสถาปัตยกรรมที่ตั้งอยู่บน Concept หรือว่าหลักการของ Client Server โดย:

> GET/posts: ดึงข้อมูลจาก posts -> axios.get('/posts')
> POST/posts: เข้าถึงทรัพยากรณ์ posts เพื่อสร้างข้อมูลใหม่ -> axios.post('/posts',{title:'Title', body: 'Body'})
> PATCH/posts/1: แก้ไขข้อมูลบางส่วนของ posts ที่มี id = 1 -> axios.patch('/posts/1', { title: 'Title'})
> DELETE/posts/1: ลบข้อมูลของ posts ที่มี id = 1 -> axios.delete('/posts/1')

---

## 📌 Parent child communication

เรียนรู้วิธีการที่มี component หลายตัวแล้วเอา component แต่ละตัวมาสื่อสารกัน

> ไฟล์: db.json

```json
{
  "notes": [
    {
      "id": 1,
      "body": "Note#1"
    },
    {
      "id": 2,
      "body": "Note#2"
    },
    {
      "id": 3,
      "body": "Note#3"
    },
    {
      "id": 4,
      "body": "Note#4"
    },
    {
      "id": 5,
      "body": "Note#5"
    }
  ]
}
```

> ไฟล์: NoteApp.js

```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function NoteApp() {
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState('')

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await axios.get('/notes')
      setNotes(data)
    }
    fetchNotes()
  }, [])

  const changeNote = (event) => setNote(event.target.value)

  const createNote = async () => {
    const { data } = await axios.post('/notes', { body: note })

    setNotes([...notes, data])
    setNote('')
  }

  return (
    <>
      <input type="text" onChange={changeNote} value={note} />
      <button onClick={createNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </>
  )
}
```

- จะเห็นได้ว่าโค้ดมี 2 ส่วนคือ ส่านที่แสดงผลฟอร์มและส่วนที่แสดงผล list เราจึงควรแยกออกมา 2 components

> ไฟล์: NoteForm.js

```js
import React, { useState } from 'react'
import axios from 'axios'

export default function NoteForm({ notes, setNotes }) {
  const [note, setNote] = useState('')

  const changeNote = (event) => setNote(event.target.value)

  const createNote = async () => {
    const { data } = await axios.post('/notes', { body: note })

    setNotes([...notes, data])
    setNote('')
  }

  return (
    <>
      <input type="text" onChange={changeNote} value={note} />
      <button onClick={createNote}>Add Note</button>
    </>
  )
}
```

> ไฟล์: NoteList.js

```js
import React, { useEffect } from 'react'
import axios from 'axios'

export default function NoteList({ notes, setNotes }) {
  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await axios.get('/notes')
      setNotes(data)
    }
    fetchNotes()
  }, [setNotes])

  return (
    <>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </>
  )
}
```

> ไฟล์: NoteApp.js

```js
import React, { useState } from 'react'

import NoteList from './NoteList'
import NoteForm from './NoteForm'

export default function NoteApp() {
  const [notes, setNotes] = useState([])
  return (
    <>
      <NoteForm notes={notes} setNotes={setNotes} />
      <NoteList notes={notes} setNotes={setNotes} />
    </>
  )
}
```

---

## 📌 css modules

## จัด style ของ NoteApp สามารถดูที่ไฟล์ได้เลยมี css modules 3 file

## 📌 Childern and Spread attributes

```js
import React from 'react'

function Layout({ children }) {
  return (
    <>
      <header>Header Area</header>
      <main>{children}</main>
      <footer>Footer Area</footer>
    </>
  )
}

function Product({ id, name, price }) {
  return (
    <dl>
      <dt>ID:</dt>
      <dd>{id}</dd>
      <dt>Name:</dt>
      <dd>{name}</dd>
      <dt>Price:</dt>
      <dd>{price}</dd>
    </dl>
  )
}

export default function App() {
  const product = { id: 1, name: 'My Product', price: 200 }
  return (
    <Layout>
      {/* layout มอง Product เป็น Children */}
      <Product {...product}></Product>
    </Layout>
  )
}
```

---

## 📌 Mui

การทำ Configure Babel สำหรับ react ที่สร้างโปรเจคโดยใช้ create-react-app (CRA)

> Install ดูได้ที่ Docs: https://mui.com/material-ui/getting-started/installation/
> Configure Babel เพื่อให้ Import แบบย่อได้โดยไม่ช้า

```js
import { Button } from '@mui/material' //import แบบย่อ
```

1. ติดตั้ง pkg แล้วสร้างไฟล์ .babelrc.js

```cmd
yarn add -D babel-plugin-import
```

> file: .babelrc.js

```js
const plugins = [
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/core',
      // Use "'libraryDirectory': ''," if your bundler does not support ES modules
      libraryDirectory: 'esm',
      camel2DashComponentName: false
    },
    'core'
  ],
  [
    'babel-plugin-import',
    {
      libraryName: '@material-ui/icons',
      // Use "'libraryDirectory': ''," if your bundler does not support ES modules
      libraryDirectory: 'esm',
      camel2DashComponentName: false
    },
    'icons'
  ]
]

module.exports = { plugins }
```

2. ติดตั้ง pkg เพิ่มแล้วสร้างไฟล์ config-overrides.js

```cmd
yarn add -D react-app-rewired customize-cra
```

> file: config-overrides.js

```js
// config-overrides.js
const { override, useBabelRc: babelRc } = require('customize-cra')

module.exports = override(babelRc())
```

> หมายเหตุ: ต้องเปลี่ยนชื่อ functon ของ useBabelRc เพราะ ESLint แจ้งเตือนผิดมันเข้าใจผิดว่า useBabelRc() เป็น React Hook แต่จริง ๆ แล้ว useBabelRc มาจาก customize-cra และเป็น Webpack override helper ไม่เกี่ยวกับ React เลย

3. เปลี่ยน scripts ในส่วนของ start ในไฟล์ package.json

   > file: package.json

   ```
   "scripts": {
   -    "start": "react-scripts start",
   +    "start": "react-app-rewired start",
     },
   ```

# จัด styled ให้กับ element ใดๆผ่านตัว Mui

> ดู theme ได้จาก https://mui.com/material-ui/customization/default-theme/

```js
import React from 'react'
import { createTheme } from '@mui/material/styles'
import { makeStyles, ThemeProvider } from '@mui/styles' // ❗

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2), // spacing(num) ตัวเลขที่ใส่จะเอาไปคูณ 8 จะได้ 8*2 = 16px
    margin: theme.spacing(1, 2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  }
}))

function AppContent() {
  const classes = useStyles()
  return <div className={classes.root}>Hello</div>
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {' '}
      {/* จาก @mui/styles */}
      <AppContent />
    </ThemeProvider>
  )
}
```

--

# Container VS Grid

1. Container เปรียบเสมือนเป็นกล่องที่มีของอยู่ข้างใน ไม่สามารถมีขนาดกล่องเกินกว่าที่เรากำหนด
2. Grid

- Grid container เปรียบเสมือนเป็นกล่อง
- Grid item เปรียบเสมือนเป็นสิ่งของที่วางอยู่ในกล่อง
  > file: App.js

```js
import React from 'react'
import { Grid, Card, CardContent } from '@mui/material'

export default function App() {
  return (
    <Grid container justifyContent="space-between" spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>xs=12 md=6</CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>xs=12 md=6</CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>xs=12 md=6</CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>xs=12 md=6</CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
```

---

> ต่อจากนี้จะเป็น workshop การสร้างโปรเจคต้องมองภาพรวมก่อนว่ามนมีส่วนย่อยๆอะไรบ้าง

> file: jsconfig.json เป็นตัว config ว่าถ้าเรา import ชื่ออะไรมันจะวิ่งไปดูที่ /src ก่อน

```js
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

---

## 📌 React router

install react-router-dom เป็นตัวบอกเส้นทาง

```cmd
yarn add react-router-dom
```

> ใช้ import { BrowserRouter as Router } from 'react-router-dom' แล้วครอบทับอยู่บนสุด ต่อไปนี้อะไรที่เป็นลูกของ tag router ก็จะสามารถประกาศ route หรือว่าเส้นทางได้

- กำหนด BrowserRouter ไว้หน้า App แล้วเรียกใช้ในหน้า /ui/Content เพื่อที่จะสร้าง Route แต่ละ components

> File: App.js

```js
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Layout from './modules/ui/components/Layout'

export default function App() {
  return (
    <Router>
      <Layout></Layout>
    </Router>
  )
}
```

> File: Contents.js in Folder /ui

```js
import React from 'react'
import { Container, Toolbar, Snackbar, Button } from '@mui/material'
import { makeStyles, ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

import ContentsRoutes from './Routes'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2, 0)
  }
}))

function Contents() {
  const classes = useStyles()
  return (
    <main className={classes.content}>
      <Container maxWidth="lg">
        <Toolbar></Toolbar>
        <ContentsRoutes></ContentsRoutes>
        <Snackbar
          open
          message="Hello"
          action={
            <Button color="inherit" size="small">
              Close
            </Button>
          }
        />
      </Container>
    </main>
  )
}

export default function Content() {
  return (
    <ThemeProvider theme={theme}>
      <Contents></Contents>
    </ThemeProvider>
  )
}
```

> File: Routes.js in Folder /ui

```js
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ProductRoutes from 'modules/products/components/Routes'
import CartRoutes from 'modules/cart/components/Routes'

export default function ContentsRoutes() {
  // ❌ ใช้ชื่อ Routes() เป็นฟังก์ชันแบบนี้จะชนกับ Routes ที่ import มาด้านบน

  return (
    <Routes>
      <Route path="/products/*" element={<ProductRoutes />} />
      <Route path="/cart/*" element={<CartRoutes />} />
      {/* ใช้ * เพราะมี Route ซ้อนกัน */}
    </Routes>
  )
}
```

> File: Routes.js in Folder /Cart

```js
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Cart from './Cart'

export default function CartRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Cart />} />
    </Routes>
  )
}
```

> File: Routes.js in Folder /Product

```js
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ProductList from './ProductList'
import ProductDetails from './ProductDetails'

export default function ProductRoutes() {
  // ❌ ใช้ชื่อ Routes() เป็นฟังก์ชันแบบนี้จะชนกับ Routes ที่ import มาด้านบน

  return (
    <>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path=":id" element={<ProductDetails />} />
      </Routes>
    </>
  )
}
```

---

## 📌 useRouteMatch
