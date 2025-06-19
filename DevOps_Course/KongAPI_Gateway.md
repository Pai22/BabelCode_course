## Kong API Gateway
### Kong API Gateway

**API Gateway** เป็นอินเตอร์เฟซที่จัดการกับ Request ต่าง ๆ ที่หลากหลาย ก่อนจะทำการส่งต่อไปยังเซอร์วิสที่อยู่ภายใน

API Gateway มีหน้าที่ดังนี้:

1. **Filter**: กรอง traffic หรือ request ที่เข้ามาจากทั้ง web, mobile, web service และอื่น ๆ โดยแก้ปัญหาได้หลายหลาก เช่น การมีหลาย Entry point (URL) ของแต่ละเซอร์วิส ทำให้ยากต่อการจดจำและเข้าถึง และปัญหาด้านความปลอดภัย เป็นต้น
2. **Single Entry Point**: เปิดเผย Endpoint ของ APIs ต่าง ๆ โดยเปิดเผยเพียงแค่ endpoint เดียว แล้วให้ request ที่เข้ามาถูกพิจารณาส่วนของ Path ก่อน เช่น เมื่อพาธเป็น /articles ให้วิ่งต่อไปยังเซอร์วิสคือ Article ส่วนนี้จึงกล่าวได้ว่า API Gateway ทำหน้าที่ Routing
3. **API Management**: การจัดการกับ API ต่าง ๆ ที่จะถูกส่งต่อไป เช่น rate limit เป็นต้น
4. **Security mechanism**: กลไกของเรื่องความปลอดภัย ไม่ว่าจะเป็นการเข้าถึงบางเซอร์วิสที่ต้องผ่านการลอคอินก่อน หรือการทำ logging เป็นต้น

API Gateway ช่วยให้การจัดการกับ Microservices ง่ายขึ้น โดยมีข้อดีดังนี้:

- **แบ่งแยกระดับชั้นของแอปพลิเคชันออกจากส่วนของ Request**: การแบ่งชั้นนี้หมายถึงการพัฒนาแอปพลิเคชันของแต่ละเซอร์วิสโดยไม่ต้องสนใจส่วนที่เกี่ยวข้องกับ Request โดยแยกส่วนจัดการ Request ให้เป็นหน้าที่ของ API Gateway แทน เช่น ให้ API Gateway เป็นผู้จัดการเรื่องของ Rate Limit แทนที่จะไปพัฒนาส่วนนี้ในทุกเซอร์วิส
- **เพิ่มความเรียบง่ายต่อการใช้งาน**: สร้างความเรียบง่ายให้กับผู้ที่จะเข้ามาใช้งานโดยการจดจำแค่ Endpoint (URL) เดียว โดยอาจแบ่งแยกการเข้าถึงเซอร์วิสภายในจากพาธแทน
- **เพิ่มระดับความปลอดภัยของระบบ**: เนื่องจากผู้ใช้งานภายนอกจะไม่สามารถเข้าถึงเซอร์วิสภายในได้เอง แต่ต้องเข้าถึงผ่าน API Gateweay เท่านั้น

ซอฟต์แวร์ API Gateway ที่นิยมในปัจจุบันมีหลายตัวในที่นี้จะนำเสนอ Kong API Gateway

Kong API Gateway เป็นระบบ API Gateway แบบ Opensource ที่คอยบริหารจัดการ API ทั้งส่วนของการทำ Routing และ Monitoring นอกจากนี้ยังรองรับ Plugin ต่าง ๆ ที่เกี่ยวข้องในการจัดการ API อีกด้วย วิธีการตั้งค่า Kong มีด้วยกันหลายวิธี สำหรับบทเรียนนี้จะนำเสนอรูปแบบการตั้งค่าผ่านไฟล์ `kong.yml` โดยสร้าง Endpoint เดียวเมื่อมี Request ส่งเข้ามาจะส่งการทำงานต่อเนื่องไปยังเซอร์วิสปลายทางโดยพิจารณาจากพาธ ดังนี้

- **/:** ให้ส่ง Request ต่อไปยังเซอร์วิส site
- **/api:** ให้ส่ง Request ต่อไปยังเซอร์วิส api
ให้ทำการสร้างไฟล์ชื่อ `kong/kong.yml` ดังนี้

```yml
_format_version: "3.0"
_transform: true

services:
  - name: site-service
    url: http://site:80
    routes:
      - name: site
        paths:
          - /
  - name: api-service
    url: http://api:3000
    routes:
      - name: api
        paths:
          - /api
```

แล้วจึงอัพเดท `docker-compose.yml` ดังนี้

```yml
version: "3.9"
services:
  site:
    image: babelcoder/intro-to-devops-ui:1.0
    ports:
      - 5151:80
  api:
    image: babelcoder/intro-to-devops-api:1.0
    ports:
      - 5152:3000
    environment:
      - DATABASE_URL=redis://db:6379
      - PORT=3000
      - APP_ENV=production
  db:
    image: redis:7.2.4-alpine
    ports:
      - 6379:6379
# -------✅เพิ่มส่วนนี้-----------
  kong:
    image: kong:3.3.1-alpine
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /user/local/kong/declarative/kong.yml
      KONG_PROXY_LISTEN: 0.0.0.0:8000
    ports:
      - 8000:8000
    volumes:
      - "./kong:/user/local/kong/declarative"
# -------เพิ่มส่วนนี้-----------


```

ทำการออกคำสั่ง `docker compose up` แล้วทดลองเรียก API ผ่าน `http://localhost:8000/api` และทดลองเรียก Site ผ่าน `http://localhost:8000`