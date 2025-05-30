## 📍สร้าง node ในโฟเดอร์ api
ใช้คำสั่งข้างล่างแล้วจะได้ไฟล์ package.json
```cmd 
pnpm init 
```
### ทำการจำลองตัว server
ใช้ package js-server

```cmd
pnpm add json-server
```
- แล้วทำการเตรียมข้อมูลในไฟล์ db.json
- วิธีรันคำสั่งจะใช้ `json-server --watch db.json` or ไปแก้ไขไฟล์ `package.json`

```json  "scripts": {
    "dev": "json-server --watch db.json --port 5151",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

