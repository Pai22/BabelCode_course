## 📍สร้าง node ในโฟเดอร์ ui
ใช้คำสั่งข้างล่างแล้วจะได้ไฟล์ package.json
```cmd 
pnpm init 
```

รันไฟล์ .mjs ใช้คำสั่ง `node (file name)` หรือ ใช้คำสั่ง `pnpm dev` แต่ต้องไป setting ที่ไฟล์ package.json
```json
      "scripts": {
        "dev": "node --watch main.mjs",
        // --watch เมื่อไฟล์เปลียนแปลงมันจะทำการรันใหม่
      },
```
---

## ใช้ fetch ในการดึงข้อมูล

1. https get เพื่อดึงข้อมูล
```js
async function getBooks() {
    const res = await fetch('http://localhost:5151/books')
    const books = await res.json() //บอกว่าข้อมูลภายในเป็น json

    console.log(books)
} 

getBooks()
```
2. https post สร้างข้อมูลใหม่
การใช้ post จะต้องมีการใส่  method, body, headers
```js
async function createBooks() {
    const res = await fetch('http://localhost:5151/books', {
        method: 'POST',
        body: JSON.stringify({ //auto ส่งไปในรูปแบบ string ของ json
            title: 'Title#3',
            decs: 'Desc#3'
        }),// body คือส่งข้อมูลไปตามโครงสร้างของ db
        headers: {
            'Content-Type': 'application/json' //บ่งบอกว่าส่งเป็นอะไรไปในที่นี้ส่งเป็น json
        }
    })
    const books = await res.json()

    console.log(books)
} 

createBooks()
```
3. https pathc คือการ update ข้อมูล

```js
async function updateBooks() {
    const res = await fetch('http://localhost:5151/books/2', {
        method: 'PATCH',
        body: JSON.stringify({
            title: 'Title#X',
            decs: 'Desc#X'
        }),// body คือส่งข้อมูลไปตามโครงสร้างของ db
        headers: {
            'Content-Type': 'application/json' //บ่งบอกว่าส่งเป็นอะไรไปในที่นี้ส่งเป็น json
        }
    })
    const books = await res.json()

    console.log(books)
} 

updateBooks()
```
