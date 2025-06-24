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