# Authentication และ Authorization
เข้าใจขั้นตอนการทำงานของ Authentication และ Authorization และศัพท์ที่เกี่ยวข้องเช่น JWT และ Bcrypt

![postman](/RestfulAPI_with_go/course-go/images/Auth.png)
![postman](/RestfulAPI_with_go/course-go/images/SingUp.png)
![postman](/RestfulAPI_with_go/course-go/images/SingIn.png)

# การสร้าง Users และการลงทะเบียน
เรียนรู้การสร้าง Model ของ User และการลงทะเบียน

# Middleware และการเข้าสู่ระบบ
เรียนรู้การสร้างและใช้งาน Middleware ใน Gin Framework พร้อมการสร้าง Authentication Middleware สำหรับจัดการการเข้าสู่ระบบ
- ทำระบบ loing ผ่าน gin-jwt สามารถดูได้[ที่นี่](https://github.com/appleboy/gin-jwt)

# การเข้าถึงข้อมูล Payload ของ JWT
เรียนรู้การใช้ Authentication Middleware ในการเข้าถึงค่า sub ของ JWT และการเข้าถึง user ผ่าน Context ของ Gin

# หลักการของ Authorization
เรียนรู้การตรวจสอบสิทธิ์การเข้าถึงทรัพยากรในเซิฟเวอร์ด้วย Authorization
![postman](/RestfulAPI_with_go/course-go/images/Author.png)

# PERM (Policy, Effect, Request, Matchers)
เข้าใจรูปแบบของการนิยามโมเดลแบบ PERM ผ่าน Casbin

![postman](/RestfulAPI_with_go/course-go/images/PERM.png)

Policy: การตั้งกฎขึ้นมา
Request: ทดสอบกฎ
Matchers: เป็นการนิยามให้ทั้งสองตัว match กัน

![postman](/RestfulAPI_with_go/course-go/images/PERM2.png)

![postman](/RestfulAPI_with_go/course-go/images/PERM3.png)

![postman](/RestfulAPI_with_go/course-go/images/Matchers.png)

เราสามารมี matchers ได้หลายตัว

![postman](/RestfulAPI_with_go/course-go/images/PERM4.png)

![postman](/RestfulAPI_with_go/course-go/images/PERM5.png)

# Role-Based Access Control (RBAC)
เรียนรู้การตรวจสอบสิทธิ์แบบ RBAC และการควบคุมผ่าน Casbin