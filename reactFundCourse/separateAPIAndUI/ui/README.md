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

---

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

## 🗝️ ต่อจากนี้จะเป็น workshop การสร้างโปรเจคต้องมองภาพรวมก่อนว่ามนมีส่วนย่อยๆอะไรบ้าง

> file: jsconfig.json เป็นตัว config ว่าถ้าเรา import ชื่ออะไรมันจะวิ่งไปดูที่ /src ก่อน

```js
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

---

## 📌 React-router-dom: React router

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

## 📌 React-router-dom: Hook()

react-router-dom v6 ไม่สามารถใช้ useRouteMatch()

| React Router v5 (เก่า)      | React Router v6 (ใหม่)             |
| --------------------------- | ---------------------------------- |
| `useRouteMatch()` ✅        | ❌ ไม่มี `useRouteMatch()`         |
| `<Switch>` ✅               | ❌ ยกเลิก ใช้ `<Routes>` แทน       |
| `<Route component={...} />` | `<Route element={<... />} />`      |
| Path matching แบบ `exact`   | ใช้ path matching ใหม่โดยอัตโนมัติ |

ใน v6 คุณสามารถใช้:

- useMatch() → สำหรับเช็กว่า path ตรงกับ pattern ไหม

- useParams() → ดึงค่า param จาก URL

- useLocation() → อ่าน current location

- useNavigate() → แทน useHistory()

---

## 📌 React-router-dom: Link

ใช้ Link ของ react-router-dom เพราะว่าถ้าใช้ของ Mui ตอนกดไปหน้า Home หรือหน้าอื่นๆจะมีการ render หน้าจอหรือกระพลิิบทำให้ไม่สมูท

```js
import { Link as RouterLink } from 'react-router-dom'

function HeaderContent() {
  const classes = useStyles()
  return (
  <RouterLink to='/'>Home</RouterLink>
  <Link
    component={RouterLink}
    to="/"
    color="inherit"
    underline="none"
    className={classes.logoLink}
  >
    <img src={logo} alt="Babel Shopping" className={classes.logoImage} />
  </Link>
  <Link
    component={RouterLink}
    to="/products"
    color="inherit"
    underline="none"
    style={{ marginLeft: 8 }}
  >
    Products
  </Link>
  )}
```

> เป็นการบอกว่า componente ที่แท้จริงที่แสดงผลนั้นคืออะไร ในที่นี้คือ เราใช้ tag Link ของ Mui เพื่อให้จัด ui ได้แต่ tag ที่ทำงานนั้นเป็นของ Link router-dom (ดูจาก componente)

---

## 📌 React-router-dom: useHistory --> useNavigate (ปัจจุบัน)

บางสถานการณ์ที่เราไม่สามารถใช้ Link เปลี่ยนหน้า page ได้จึงต้องใช้ useNavigate ในการเปลียนหน้าเพจแทน

```js
import { useNavigate } from 'react-router-dom'

function HeaderContent() {
  const navigate = useNavigate()

  const navigateToCart = () => navigate('/cart')

  return (
    <IconButton color="inherit" onClick={navigateToCart}>
      <Badge badgeContent={5} color="secondary">
        <ShoppingCart></ShoppingCart>
      </Badge>
    </IconButton>
  )
}
```

> หมายเหตุ: ใช้ useNavigate แทน useHistory ใน v6 up

---

## 📌 React-router-dom: useRouteMatch --> useMatch (ปัจจุบัน)

ใช้สำหรับ เช็กว่าปัจจุบันตรงกับ path ที่เราระบุไว้หรือไม่ และดึง ข้อมูลพารามิเตอร์จาก URL

### 📦 ผลลัพธ์ของ useMatch

```js
{
  params: { id: '123' },
  pathname: '/products/123',
  pattern: { path: '/products/:id', caseSensitive: false, end: true }
}

```

> useMatch = ตรวจสอบว่าปัจจุบันตรงกับ path ที่ระบุหรือไม่ และดึง param ได้ เหมาะใช้ในสถานการณ์ที่อยู่นอก <Route> หรืออยากเช็ก path เฉพาะเจาะจง

### 🟦 ใช้ useMatch() เช็ก path และอ่าน param

```js
// ProductDetailsMatch.js
import React from 'react'
import { useMatch } from 'react-router-dom'

export default function ProductDetailsMatch() {
  const match = useMatch('/products/:id')

  if (!match) {
    return <div>Not matched</div>
  }

  const { id } = match.params

  return (
    <div>
      <h2>Matched Path: /products/:id</h2>
      <p>Product ID: {id}</p>
    </div>
  )
}
```

---

## 📌 React-router-dom: useLocation()

useLocation() ใน React Router ใช้เพื่อ อ่านตำแหน่งปัจจุบันของ URL ค่ะ เช่น pathname, search (query string), hash ฯลฯ

### ✅ ตัวอย่างข้อมูลที่ได้จาก useLocation()

```js
{
  pathname: "/products/123",
  search: "?ref=homepage",
  hash: "#section1",
  state: null,
  key: "abc123"
}

```

### 🧪 ตัวอย่างการใช้งานจริง

```js
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function LocationInfo() {
  const location = useLocation()

  return (
    <div>
      <h3>Current Path Info</h3>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search}</p>
      <p>Hash: {location.hash}</p>
    </div>
  )
}
```

---

## 📌 React-router-dom: useParams()

ช้เพื่อ ดึงค่าพารามิเตอร์จาก URL ที่กำหนดไว้ในเส้นทาง (route) ค่ะ เช่น /productsฝ:id → ดึงค่า id ออกมา

### ✅ ใช้ในกรณีไหน

สมมุติเรากำหนดเส้นทางแบบนี้ใน Route:

```js
<Route path="/products/:id" element={<ProductDetail />} />
```

ถ้าเปิดหน้า /products/123 → React Router จะส่ง id = "123" มาให้

### 🧪 ตัวอย่างการใช้งาน

```js
import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams()

  return (
    <div>
      <h2>Product Detail</h2>
      <p>Product ID: {id}</p>
    </div>
  )
}
```

### 🧠 สรุปการใช้งาน

| ต้องการ         | เขียน Route                      | ใช้ใน Component                           |
| --------------- | -------------------------------- | ----------------------------------------- |
| อ่านค่าจาก path | `/users/:userId`                 | `const { userId } = useParams()`          |
| หลาย params     | `/users/:userId/orders/:orderId` | `const { userId, orderId } = useParams()` |

> หมายเหตุ: `useParams()` จะคืนค่าเป็น object ของพารามิเตอร์ทั้งหมดใน path และ ใช้ เฉพาะกับ Route ที่มี param เท่านั้น (มี `:`)

---

## 📌 query-string

query-string คือไลบรารีที่สามารถ

- แปลง query string เป็น object (เช่น `?page=2&sort=asc`→ `{ page: '2', sort: 'asc' }`)
- แปลง object เป็น query string (เช่น `{ page: 2, sort: 'asc' }` → `?page=2&sort=asc`)

```cmd
yarn add query-string
```

### ✅ ตัวอย่างการใช้งาน

1. แปลง `query string` → `object`

```js
import queryString from 'query-string'

const query = '?page=2&sort=asc'
const parsed = queryString.parse(query)

console.log(parsed) // { page: '2', sort: 'asc' }
```

2. แปลง `object` → `query string`

```js
import queryString from 'query-string'

const obj = { page: 2, sort: 'asc' }
const query = queryString.stringify(obj)

console.log(query) // page=2&sort=asc
```

> `{category || 'All'}` บ่งบอกว่าถ้า category เป็น null จะแสดงคำว่า All

---

## 📌 Navigate ( แทน Redirect )

เมื่อเราคลิกไปที่หน้า Home แต่ Home page ไม่มีอะไร ต้องการให้มันเด้งไปหน้า products แทน

### 🔁 เปลี่ยนเส้นทางอัตโนมัติ (Auto Redirect)

```js
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import ProductRoutes from 'modules/products/components/Routes'
import CartRoutes from 'modules/cart/components/Routes'

export default function ContentsRoutes() {
  // ❌ ใช้ชื่อ Routes() เป็นฟังก์ชันแบบนี้จะชนกับ Routes ที่ import มาด้านบน

  return (
    <Routes>
      {/* ใช้ `*` เพราะมี Route ซ้อนกัน */}
      <Route path="/products/*" element={<ProductRoutes />} />
      <Route path="/cart/*" element={<CartRoutes />} />
      {/* Redirect หน้าแรก */}
      <Route exact path="/" element={<Navigate to="/products" />} />
    </Routes>
  )
}
```

> หมายเหตุ: ถ้าไม่ใส่ exact หน้าที่ไม่มีอยู่จริงก็จะเข้าเงื่อนไขกับ path="/" ด้วย

### 🔐 ตัวอย่างกรณี redirect เมื่อยังไม่ login

```js
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}
```

ใช้ใน Route แบบนี้:

```js
<Route
  path="/dashboard"
  element={
    <ProtectedRoute isLoggedIn={user?.loggedIn}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

> ✅ ถ้า `user.loggedIn` เป็น `false` → ระบบจะ redirect ไปหน้า `/login`

### 🔙 Redirect ไปหน้าก่อนหน้า (Back)

```js
import { useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate()

  return <button onClick={() => navigate(-1)}>ย้อนกลับ</button>
}
```

### จัดการเกี่ยวกับหน้าที่ไม่มีอยู่จริง

```js
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import ProductRoutes from 'modules/products/components/Routes'
import CartRoutes from 'modules/cart/components/Routes'

export default function ContentsRoutes() {
  // ❌ ใช้ชื่อ Routes() เป็นฟังก์ชันแบบนี้จะชนกับ Routes ที่ import มาด้านบน

  return (
    <Routes>
      {/* ใช้ `*` เพราะมี Route ซ้อนกัน */}
      <Route path="/products/*" element={<ProductRoutes />} />
      <Route path="/cart/*" element={<CartRoutes />} />
      {/* Redirect หน้าแรก */}
      <Route exact path="/" element={<Navigate to="/products" />} />
      {/* 404 Page Not Found */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  )
}
```

> path="\*" → จับทุกเส้นทางที่ไม่ตรงกับ route ด้านบน → ใช้แสดง หน้า 404

---

## 📌 React-hook-form

ทำการติดตั้ง package ก่อน

```cmd
yarn add react-hook-form
```

### ตัวอย่างโค้ด

```js
import React from 'react'
import { useForm } from 'react-hook-form'

export default function App() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      gender: 'Female'
    }
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="Email" {...register('email')} />
      <input type="password" placeholder="Password" {...register('password')} />
      <input type="text" placeholder="gender" {...register('gender')} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## 📌 ตรวจสอบความถูกต้องของฟอร์มด้วย Yup

Yup เป็นสิ่งที่ใช้ในการ validate ข้อมูลใน form ของเราที่เป็น Opjecte

### ติดตั้ง package

```cmd
yarn add @hookform/resolvers yup

```

> การ validate ข้อมูล (data validation) หมายถึง การตรวจสอบความถูกต้องและคุณภาพของข้อมูล เพื่อให้มั่นใจว่าข้อมูลที่รวบรวมมานั้นมีคุณภาพสูง และสามารถนำไปใช้งานได้อย่างถูกต้องและมีประสิทธิภาพ

## โค้ดตัวอย่างการตรวจสอบข้อมูล

```js
import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur', // เมื่อมีการเปลี่ยนแปลง input จะ validate ทันที
    defaultValues: {
      gender: 'Female'
    },
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().required(), // required บ่งบอกว่าช่องนี้ต้องใส่ทุกครั้ง
        password: yup.string().min(8).required(),
        gender: yup.mixed().oneOf(['Male', 'Female'])
      })
    )
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="Email" {...register('email')} />
      {errors.email && <div>{errors.email.message}</div>}
      <input type="password" placeholder="Password" {...register('password')} />
      {errors.password && <div>{errors.password.message}</div>}
      <input type="text" placeholder="gender" {...register('gender')} />
      {errors.gender && <div>{errors.gender.message}</div>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

โครงสร้างของ yup

```js
let userSchema = object({
  name: string().required(),
  age: number().required().positive().integer(),
  email: string().email(),
  website: string().url().nullable(),
  createdOn: date().default(() => new Date())
})
```

จัดการ form

> File: Delivery.js

```js
import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { createTheme, ThemeProvider } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  CardContent,
  TextField,
  Typography,
  Card,
  CardActions,
  Button,
  Stack
} from '@mui/material'

const theme = createTheme()

const useStyles = makeStyles((theme) => ({
  form: {
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  submitBtn: {
    flex: 1 // กำหนดให้ Button กินพื้นที่เต็ม
  }
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required()
})

export default function Delivery() {
  const classes = useStyles()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const submit = (deliveryInfo) => {
    console.log(deliveryInfo)
  }

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit(submit)} autoComplete="off">
        <Card>
          <CardContent className={classes.form}>
            <Typography variant="h5" component="h2">
              Delivery Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                {...register('name')}
                variant="outlined"
                label="Name"
                placeholder="Enter your fullname"
                name="name"
                fullWidth
                helperText={errors.name?.message || ''} // helperText ของ TextField ข้อความที่เป็นตัวช่วย
                error={!!errors.name} // error={true} ของ TextField จะแสดงข้อความเป็นสีแดงพร้อมกรอบ
                //error={!!errors.name} ใส่เครื่ิงหมายตกใจ 2 ครั้งเป็นการทำให้ errors.name เป็น boolean
              />
              <TextField
                {...register('email')}
                type="email"
                variant="outlined"
                label="email"
                placeholder="Enter your email"
                name="email"
                fullWidth
                helperText={errors.email?.message || ''}
                error={!!errors.email}
              />
              <TextField
                {...register('address')}
                multiline
                rows={4}
                variant="outlined"
                label="Address"
                placeholder="Enter your fullname"
                name="address"
                fullWidth
                helperText={errors.address?.message || ''}
                error={!!errors.address}
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitBtn}
            >
              Place Order
            </Button>
          </CardActions>
        </Card>
      </form>
    </ThemeProvider>
  )
}
```

---

## 📌 Redux คืออะไร ทำไมจึงสำคัญ

วิธีจัดการกับ state ที่ไหลเวียนอยู่ในแอพอย่างมีประสิทธิภาพ
หลักการของ Redux เรียกว่า Redux Principles

1. Redux Principles: Single source of truth

- ความหมายคือ ความจริงมีอยู่แค่หนึ่งเดียวและอยู่ภายใต้ store สมมติมีข้อมูลและก็ state ที่ใใช้งานอยู่ในแอปพลิเคชันของเรา ข้อมูลเหล่านั้นก็จะถูกจัดเก็บอยู่ภายใต้ store แค่ตัวเดียว นั่นคือ store ไม่สามารถมีได้มากกว่าหนึ่งตัว
- ถ้ามี store แค่ตัวเดียวก็จะมี component หลายๆตัวมาเกาะอยู่ store
- component แต่ละตัวสามารถอ่านค่าข้อมูลจาก store ได้แลเวเอาค่าข้อมูลนั้นไปทำการ render หรือแสดงผลบน component และ component ยังสามารถเขียนค่าข้อมูลลงไปยังใน store ได้
- ถ้ามี component ตัวนึงทำการ subscribe (subscribe คือทำการอ่านข้อมูลบน store) แล้ว component อีก 3 ตัวทำการเขียนข้อมูลไปบน store แล้ว component ที่กำลังอ่านข้อมูลบน store จะรู้ได้ยังไงว่าการเปลี่ยนแปลงข้อมูลมาจาก component ไหน `จึงต้องไปหลักการข้อ 2`

2. Redux Principles: Store is read only

- ความหมายคืิอ Views หรือ componete จะสามารถอ่านค่าจาก store ได้เท่านั้นไม่สามารถเขียนค่าไปบน store ได้
- ตัว views หรือ component เมื่อเกิดเหตุการณ์นึ่งขึ้นมา เช่นคลิกปุ่ม ก็จะทำการสร้าง actions เมื่อสร้างเสร็จก็จะถูกส่งไปยัง reducers กระบวนการส่งเรียกว่่า dispatch แล้ว reducers จะทำการลดข้อมูลคือเอาข้อมูลเฉพาะที่สนใจแล้วส่งไปยัง store
- จะเห็นได้ว่า component จะทำหน้าที่อยู่ 2 อย่างจึงต้องแยกหน้าที่ใน generate หรือ สร้างตัว Actions มาเพิ่ม เรียกว่า Action Creators มีหน้าที่ในการสร้างตัว Action ออกมา

3. Redux Principles: Changes are made with pure functions (เพียว function)

- ตัว Reducers จะต้องเป็นเพียว function

### ติดตั้งตัว package

```cmd
yarn add redux react-redux
```

ติดตั้ง package ของ redux-devtools ใน Chrome

```cmd
yarn add -D redux-devtools-extension
```

---

## 📌 วิธีการสร้าง store พร้อมกับใช้งาน reduucers

1. สร้าง folder store แล้วใน folder store มีไฟล์ configureStore.js
   > file: configureStore.js

```js
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from 'modules/reducers'

export default function configureStore(initialState) {
  const middleware = []
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  )

  return store
}
```

2. สร้างไฟล์ reducers.js ไว้แต่ละ folder
   > file: /modules/reducers.js

```js
import { combineReducers } from 'redux'

import ui from './ui/reducer'
import products from './products/reducer'
import cart from './cart/reducer'

export default combineReducers({
  ui,
  products,
  cart
})
```

> file: /modules/ui/reducers.js

```js
const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
```

> file: /modules/cart/reducers.js

```js
const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
```

> file: /modules/products/reducers.js

```js
const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
```

---

## 📌 Actions และ Action Creators
