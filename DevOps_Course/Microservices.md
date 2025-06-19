# Microservices Architecture

## Monolithic Architecture

![Monolithic Architecture](/DevOps_Course//Images/monolithic.png)

การออกแบบแอปพลิเคชันแบบ Monolithic รวมศูนย์ฟีเจอร์ทั้งหมดไว้ในแอปเดียว โดยใช้ฐานข้อมูลร่วมกันสำหรับทุกฟีเจอร์

### ข้อดีของ Monolithic
- พัฒนาได้ง่าย
- แก้ไขหรือเปลี่ยนแปลงได้ง่าย
- ทดสอบฟังก์ชันต่าง ๆ ได้ตรงไปตรงมา
- Deploy ได้ง่าย
- Scale ระบบได้ง่ายระดับหนึ่ง

### ข้อเสียของ Monolithic
- **ผูกติดกับภาษาโปรแกรม**: ไม่สามารถเปลี่ยนภาษาในบางส่วนของแอปได้
- **การทำงานร่วมกันในทีมยาก**: ทุกฟีเจอร์อยู่ใน repository เดียว
- **Deploy ช้า**: ระบบ CI/CD ใช้เวลานาน
- **Scaling ไร้ประสิทธิภาพ**: ต้อง scale ทั้งแอป แม้ใช้แค่บางส่วน (Horizontal Scaling)

---
![Horizontal Scaling](/DevOps_Course//Images/horizontal-scaling.png)


## 1. Microservices คืออะไร

เพื่อแก้ปัญหาของ Monolithic ดังกล่าว จึงเป็นที่มาของสถาปัตยกรรมแบบ Microservices

สถาปัตยกรรมแบบ Microservices เป็นสถาปัตยกรรมที่ออกแบบตามหลักการของ Cloud Native โดยระบบหนึ่ง ๆ จะประกอบไปด้วยหลายหน่วยย่อยหรือเซอร์วิส ที่มีการเชื่อมต่อกันอย่างหลวม ๆ กับเซอร์วิสอื่น แต่ละเซอร์วิสจะมีขนาดเล็กและแยก Deploy ได้อย่างอิสระ
![Microservices](/DevOps_Course//Images/microservices.png)


---

## 2. ลักษณะพื้นฐานของ Microservices

![Microservices Scaling](/DevOps_Course//Images/microservices-scaling.png)

- **Autonomy**: แต่ละเซอร์วิสพัฒนาและ deploy แยกกันได้
- **Specialization**: ออกแบบตาม Business Capability
- **Agility**: ทีมเล็กจัดการแต่ละเซอร์วิสได้อย่างคล่องตัว
- **Flexible Scaling**: สามารถ scale เฉพาะเซอร์วิสที่จำเป็น

---

## 3. API Gateway คืออะไร

การสื่อสารจากโลกภายนอกสู่ระบบของ Microservices นั้น เราสามารถเข้าถึงเซอรืวิสต่าง ๆ ได้โดยตรงผ่าน IP และ API ของแต่ละเซอร์วิส

![External call to microservices](/DevOps_Course//Images/external-call-to-microservices.png)

อย่างไรก็ตามการอนุญาตให้ภายนอกสามารถเข้าถึงเซอร์วิสต่าง ๆ ได้โดยตรงย่อมมีข้อเสีย กล่าวคือเป็นการทำให้ผู้ใช้ภายนอกรับรู้ถึงการมีอยู่ของโครงสร้างระบบภายในของเรามากเกินไป อีกทั้งยังทำให้เกิดความซับซ้อนในการใช้งาน เนื่องจากผู้ใช้งานต้องจดจำ IP ของเซอร์วิสต่าง ๆ เพื่อเรียกใช้งานได้อย่างถูกต้อง ด้วยเหตุนี้เราจึงสร้างตัวกลางที่เรียกว่า `API Gateway` คั่นกลางระหว่างโลกภายนอกกับระบบภายในของเรา เมื่อใดก็ตามที่ผู้ใช้งานต้องการเข้าถึงระบบจะติดต่อผ่าน API Gateway แทน เช่นทำการเรียก `/orders` ผ่าน API Gateway แล้วตัว Gateway จึงทำการส่งการร้องขอนี้ต่อไปยังเซอร์วิสปลายทางคือ Order อีกครั้ง

![Api gateway](/DevOps_Course//Images/api-gateway.png)

### ข้อดี
- ซ่อนโครงสร้างภายในจากผู้ใช้ภายนอก
- ลดความซับซ้อนในการเข้าถึงแต่ละเซอร์วิส
- สามารถจัดการการตรวจสอบสิทธิ์และ rate limiting ได้

---

## 4. การสื่อสารระหว่างเซอร์วิส
การทำงานของเซอร์วิสต่าง ๆ อาจไม่สมบูรณ์ด้วยตัวของมันเองหากแต่ต้องมีการสื่อสารกับเซอร์วิสอื่นเพื่อให้การทำงานโดยรวมของระบบนั้นเสร็จสมบูรณ์

สมมติให้ระบบของเราประกอบด้วยเซอร์วิสต่าง ๆ ได้แก่ Order Stock และ Payment โดยกำหนดสถานการณ์ว่าผู้ใช้งานต้องการสั่งซื้อสินค้าผ่านการสร้างคำสั่งซื้อ (order) เมื่อคำสั่งซื้อได้รับการสร้างในเซอร์วิสของ Order แล้วจะยังไม่ถือว่าเสร็จสิ้นขั้นตอน แต่ต้องทำการตรวจสอบสินค้าก่อนว่ามีหรือไม่ใน Stock สุดท้ายเมื่อพบว่าสินค้ามีพร้อมจำหน่ายจึงทำการเรียกเซอร์วิส Payment เพื่อทำการชำระค่าสินค้าต่อไป ภายหลังที่กระบวนการของ Payment เสร็จสิ้นจึงถือว่าคำสั่งซื้อเสร็จสมบูรณ์

จากสถานการณ์ข้างต้นจะพบว่าเซอร์วิสต่าง ๆ ย่อมต้องมีการสื่อสารกัน กระบวนการของ Microservices สามารถสร้างการสื่อสารได้สองรูปแบบคือ `Synchronous Messages` และ `Asynchronous Messages`



### 4.1 Synchronous Communication
- เซอร์วิสรอผลลัพธ์จากกันและกัน
- ตัวอย่าง: REST, GraphQL, gRPC
- **ข้อเสีย**: เสี่ยงต่อ bottleneck และล้มเหลวแบบ chain reaction

การสื่อสารในลักษณะแบบนี้เป็นการสื่อสารที่เซอร์วิสหนึ่งจะส่งคำร้องไปยังเซอร์วิสถัดไปพร้อมรอผลลัพธ์การทำงานด้วยการตอบกลับจากเซอร์วิสปลายทาง
![Synchronous messages](/DevOps_Course//Images/synchronous-messages.png)
การสื่อสารระหว่างเซอร์วิสในรูปแบบนี้อาจเชื่อมต่อผ่านเว็บเซอร์วิสประเภทต่าง ๆ เช่น RESTful API, GraphQL API หรือ gRPC เป็นต้น
![synchronous-communication](/DevOps_Course//Images/synchronous-communication.png)
อย่างไรก็ตามการสื่อสารแบบ Synchronous มีข้อเสียบางประการ เช่น ถ้าเซอร์วิส Stock ใช้ระยะเวลาประมวลผลนานนั่นจะทำให้เซอร์วิส Order ไม่สามารถประมวลผลสิ่งใดได้ต่อจนกว่าจะได้รับผลลัพธ์จาก Stock เป็นเหตุให้ผู้ใช้งานฝั่ง Order ต้องเข้าคิวรอรับบริการในเซอร์วิสนี้นานตามไปด้วย อีกหนึ่งปัญหาที่สำคัญของการสื่อสารแบบ Synchronous คือความน่าเชื่อถือว่าระบบจะสามารถทำงานต่อไปได้อย่างถูกต้องหรือไม่หากบางเซอร์วิสนั้นไม่สามารถใช้งานได้

### 4.2 Asynchronous Communication
การสื่อสารแบบ Asynchronous สามารถแก้ไขข้อจำกัดหลายประการของการสื่อสารแบบ Synchronous ได้ด้วยวิธีการสื่อสารแบบไม่ต้องรอการตอบกลับ ในสถาปัตยกรรมการสื่อสารแบบ Asynchronous นี้จะพบว่ามีการใช้ซอฟต์แวร์ประเภท Message Broker เช่น Rabbit MQ หรือ Apache Kafra เพื่อเป็นตัวช่วยในการสร้างช่องทาง (Channel) ในการสื่อสาร เซอร์วิสต่าง ๆ ที่ต้องการเชื่อมการสื่อสารไปยังเซอร์วิสอื่นจะทำการทิ้งเหตุการณ์ (Event) ลงไปยัง channel ที่มีเซอร์วิสปลายทางของรับอยู่ เมื่อเซอร์วิสปลายทางเห็นเหตุการณ์ที่ตนสนใจอยู่จึงนำค่าเหตุการณ์นี้ไปประมวลผลต่อ โดยการสื่อสารทั้งหมดนี้ของแต่ละเซอร์วิสไม่ได้มีการรอคอยผลลัพธ์ของกันและกันในทันที

![asynchronous-messages](/DevOps_Course//Images/asynchronous-messages.png)

- ไม่รอผลลัพธ์, ใช้ Message Broker เช่น RabbitMQ, Apache Kafka
- เหมาะกับงานที่เสร็จภายหลังก็ได้ เช่น ส่งอีเมลรายงาน

### 4.3 ควรเลือกแบบใด?
#### ใช้ Synchronous เมื่อ:
- จำเป็นต้องได้ข้อมูลก่อนดำเนินการต่อ
- ต้องการผลลัพธ์แบบ real-time

#### ใช้ Asynchronous เมื่อ:
- ยอมรับ delay ได้
- การประมวลผลใช้เวลานาน
- ต้องการ retry และ resilience

---

## 5. Saga Pattern

ใช้เพื่อจัดการ **Data Consistency** ในระบบ Microservices ที่ฐานข้อมูลแยกกัน โดยแบ่งธุรกรรมออกเป็นส่วนย่อย (Local Transactions)

### 5.1 Choreography-based Saga
รูปแบบของ Choreography-based Saga นี้จะเรียกเซอร์วิสต่าง ๆ ที่เข้ามาเกี่ยวข้องว่า Saga Participant มีหน้าที่ในการสอดส่องเหตุการณ์ที่เกี่ยวข้องกับการทำงานของตน เมื่อได้รับเหตุการณ์นั้นแล้วจึงทำการประมวลผลต่อและส่งต่อเหตุการณ์ใหม่ไปยัง channel เพื่อให้เซอร์วิสถัดไปมองเห็นและดำเนินการสำหรับขั้นตอนถัดไป

![choreography-based-saga](/DevOps_Course//Images/choreography-based-saga.png)
ต่อไปนี้เป็นตัวอย่างของขั้นตอนการทำงานของ Choreography-based Saga สำหรับการสร้างคำสั่งซื้อ

1. เริ่มจากผู้ใช้งาน (หรือ API Gateway) สร้างเหตุการณ์ ORDER_REQUESTED เพื่อร้องขอการสร้างคำสั่งซื้อส่งไปยังเซอร์วิส Order
2. เมื่อเซอร์วิส Order สร้างคำสั่งซื้อเสร็จสิ้นจะสร้างเหตุกรณ์ ORDER_CREATED ปล่อยลง channel ของเซอร์วิส Stock
3. เซอร์วิส Stock มองเห็นเหตุการณ์ ORDER_CREATED ใน channel ของตน จึงดำเนินการลดสินค้าคงคลังพร้อมกับสร้างเหตุการณ์ ORDER_RESERVED ปล่อยไปยัง channel ของ Payment
4. เมื่อเซอร์วิส Payment มองเห็นเหตุการณ์ ORDER_RESERVED จึงทำการรับชำระคำสั่งซื้อ ภายหลังการดำเนินงานเสร็จสิ้นจะทำการส่งเหตุการณ์ ORDER_PLACED ไปยัง channel ของ Order คำสั่งซื้อจึงเสร็จสมบูรณ์ ต่อไปนี้เป็นตัวอย่างบางส่วนของโค้ดสำหรับการดักจับเหตุการณ์ ORDER_CREATED
![achoreography-based-saga-code-example](/DevOps_Course//Images/choreography-based-saga-code-example.png)

- ไม่มีศูนย์กลาง
- เซอร์วิสตอบสนองเหตุการณ์และกระจาย event ต่อกันเป็น chain
- ตัวอย่าง:
  - `Order` สร้างคำสั่งซื้อ → ปล่อย `ORDER_CREATED`
  - `Stock` เห็น `ORDER_CREATED` → ปรับ Stock → ส่ง `ORDER_RESERVED`
  - `Payment` เห็น `ORDER_RESERVED` → ดำเนินการชำระเงิน → ส่ง `ORDER_PLACED`

### 5.2 Orchestration-based Saga
Orchestration-based Saga เป็นรูปแบบที่มีเซอร์วิสหนึ่งทำหน้าที่เป็นผู้ควบคุมขั้นตอนการดำเนินงาน เรียกเซอร์วิสนี้ว่าเป็น Orchestrator โดยทำหน้าที่ดำเนินการผ่านการตรวจตราเหตุการณ์ต่าง ๆ ที่เกี่ยวข้องแล้วจึงประมวลผลด้วยการส่งเหตุการณ์ที่ควรเป็นไปยังเซอร์วิสปลายทางที่มีหน้าที่ในการจัดการสิ่งนั้น Orchestrator จะมีการบันทึกสถานะของการดำเนินงานต่าง ๆ ที่เกี่ยวข้องในรูปแบบของ Saga Log

![corchestration-based-saga](/DevOps_Course//Images/corchestration-based-saga.png)

ต่อไปนี้เป็นตัวอย่างของขั้นตอนการทำงานของ Orchestration-based Saga สำหรับการสร้างคำสั่งซื้อ

1. เริ่มจาก Orchestrator สร้างเหตุการณ์ ORDER_REQUESTED ไปยังเซอร์วิส Order พร้อมกับทำการบันทึก T1 ลงไปยัง Saga Log
2. ภายหลังที่เซอร์วิส Order เห็นเหตุการณ์ ORDER_REQUESTED จึงทำการสร้างคำสั่งซื้อพร้อมกับส่งเหตุการณ์ ORDER_CREATED ลงไปยัง channel
3. Orchestrator พบเหตุการณ์ ORDER_CREATED จึงทำการบันทึก T2 ลง Saga Log พร้อมกับสร้างเหตุการณ์ CHECK_STOCK_REQUESTED ไปยัง channel ของ Stock พร้อมบันทึก T3 ลง Saga Log
ขั้นตอนอื่น ๆ เป็นไปตามภาพที่แสดงการทำงานข้างต้น

- มี Orchestrator ควบคุมลำดับขั้นตอน
- บันทึกสถานะแต่ละขั้นใน **Saga Log**
- ตัวอย่าง:
  - Orchestrator → `ORDER_REQUESTED` → `Order`
  - `Order` → `ORDER_CREATED` → Orchestrator
  - Orchestrator → `CHECK_STOCK_REQUESTED` → `Stock`

---

## 6. Compensating Transactions

หากเกิดความผิดพลาดระหว่าง Transaction จำเป็นต้องมี **Compensating Transaction** เพื่อย้อนกลับ

### ตัวอย่าง:
- T1: `Order requested` → C1: `Order cancelled`
- หาก `Stock` ล้มเหลว, Orchestrator เรียก C1 เพื่อยกเลิกคำสั่งซื้อ
![corchestration-based-saga](/DevOps_Course//Images/compensating-transactions.png)

ต่อไปนี้เป็นตัวอย่างของการจัดการ Rollback เพื่อให้ข้อมูลยังคงสอดคล้องกันอยู่

1. เริ่มจาก Orchestrator สร้างเหตุการณ์ ORDER_REQUESTED ไปยังเซอร์วิส Order พร้อมกับทำการบันทึก T1 ลงไปยัง Saga Log
2. ภายหลังที่เซอร์วิส Order เห็นเหตุการณ์ ORDER_REQUESTED จึงทำการสร้างคำสั่งซื้อพร้อมกับส่งเหตุการณ์ ORDER_CREATED ลงไปยัง channel
3. Orchestrator พบเหตุการณ์ ORDER_CREATED จึงทำการบันทึก T2 ลง Saga Log พร้อมกับสร้างเหตุการณ์ CHECK_STOCK_REQUESTED ไปยัง channel ของ Stock พร้อมบันทึก T3 ลง Saga Log
4. Stock พบเหตุการณ์ CHECK_STOCK_REQUESTED แต่การทำงานล้มเหลวจึงส่งเหตุการณ์ STOCK_REJECTED ลง channel
5. Orchestrator พบ STOCK_REJECTED จึงทำการบันทึก T4 ลง Saga Log
6. Orchestrator ทำการเรียกธุรกรรมย้อนกลับ (Compensating Transaction) ของ T3 แต่ T3 ไม่จำเป็นต้องดำเนินการย้อกลับแต่อย่างใด
7. Orchestrator ทำการเรียกธุรกรรมย้อนกลับของ T2 แต่ T2 ไม่จำเป็นต้องดำเนินการย้อกลับแต่อย่างใด
8. Orchestrator ทำการเรียกธุรกรรมย้อนกลับของ T1 คือ C1: Order cancelled เพื่อเป็นการยกเลิกคำสั่งซื้อพร้อมบันทึก C1 ลง Saga Log

---

