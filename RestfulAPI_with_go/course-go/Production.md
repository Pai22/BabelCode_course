# RESTful API Design
หลักการออกแบบ RESTful API ที่ดีเพื่อให้งานต่อการใช้งานf

![postman](/RestfulAPI_with_go/course-go/images/RV.png)
- การทำ restful api ต้องทำการใส่ version เสมอ
- คือข้อมูลที่จำเป็นสำหรับ client เท่านั้นถ้าคืนออกไปทั้งหมดอาจเปลือง Bw

![postman](/RestfulAPI_with_go/course-go/images/Path.png)

- ควรแบ่งแยกกลุ่มของ path อย่างชัดเจน

# CORS
หลักการของ CORS และการปรับโค้ดเพื่อใช้งานได้กับเว็บ สามารถดาวน์โหลดส่วนของ UI ได้จาก [ที่นี่](https://www.dropbox.com/scl/fi/3h4vucg1c2x7shbae78ze/ui.zip?rlkey=0wj6otvv5jgu6pffzvx6sgpgg&dl=0)

# Deployment 
### บนเครื่อง
```bash
$ export HOST=http://127.0.0.1:5001   
$ export PORT=5001   
$ export DATABASE_CONNECTION="host=localhost port=5432 sslmode=disable user=postgres dbname=articles password="
$ export SECRET_KEY=$(uuidgen) 
$ export APP_ENV=production
$ go build
$ ./course-go
```

### colud platform
เลือกใช้ Heroku
- ต้อง add credit card
- พอ add แล้วจะสามารถ create ได้ 

```bash
$ heroku create
$ git push heroku master
```

- เสร็จแล้วมันจะ deploy code `./bin/course-go` ต้องไปสร้างไฟล์ `Procfile` แล้วใส่ `web: bin/course-go` ลงไปแล้ว save แล้วออกคำสั่ง

```bash
$ git add -A
$ git commit -m "Add Procfile"
$ git push heroku master
```

- เพิ่มส่วนของ database ด้วยคำสั่ง

```bash
$ heroku addons:create heroku-postgresql:hobby-dev
```

- ในส่วนของ database มันใช้ `DARABASE_URL` ดังนั้นในไฟล์ `.env` จึงต้องเปลี่ยน `DATABASE_CONNECTION` -> `DARABASE_URL` แล้วใน db.go มีส่วนที่เรียกใช้ก็ต้องเปลี่ยนด้วย เสร็จแล้วก็ทำการ `$ git push heroku master`

- set ค่าในไฟล์ .env เพราบน git เราไม่มี
```bash
$ heroku config:set SECRET_KEY=$(uuidgen)
$ heroku config:set HOST=(url ที่ deploy ไป)
$ heroku config:set GIN_MODE=release APP_ENV=production
```

- เสร็จแล้วทำการเช็คตัวที่เรา config ได้จากคำสั่ง แล้วเปิด
```bash
$ heroku config
$ heroku open
```