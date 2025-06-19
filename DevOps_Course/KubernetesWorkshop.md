# Kubernetes Workshop
กำหนดให้ส่วนหนึ่งของระบบบัญชีประกอบด้วย Services ต่าง ๆ ดังนี้

- Site: เซอร์วิสสำหรับการแสดงผล UI บนเว็บเบราว์เซอร์
- Revenue Cycle: เป็นเซอร์วิสเกี่ยวกับวงจรรายได้ของบัญชี เช่น รายได้จากการขาย รายได้จากการให้บริการ เป็นต้น
- Tax Calculator: เซอร์วิสสำหรับการคำนวณภาษาประเภทต่าง ๆ เช่น ภาษีหัก ณ ที่จ่าย ภาษีมูลค่าเพิ่ม เป็นต้น
- Report: เซอร์วิสสำหรับการออกรายงานทางการเงินประเภทต่าง ๆ เช่น งบแสดงฐานะการเงิน งบกำไรขาดทุน เป็นต้น
- Email: เซอร์วิสสำหรับการจัดส่งอีเมล์ไปยังปลายทาง

กำหนดให้เซอร์วิสต่าง ๆ มีหมายเลขพอร์ตและสถานการณ์การเข้าถึง ดังต่อไปนี้

- Site: พอร์ตหมายเลข 80 สามารถเข้าถึงได้จากทั้งในและนอก Kubernetes Cluster
- Revenue Cycle: พอร์ตหมายเลข 5121 สามารถเข้าถึงได้จากใน Kubernetes Cluster เท่านั้น
- Tax Calculator: พอร์ตหมายเลข 5122 สามารถเข้าถึงได้จากใน Kubernetes Cluster เท่านั้น
- Report: พอร์ตหมายเลข 5123 สามารถเข้าถึงได้จากใน Kubernetes Cluster เท่านั้น
-Email: พอร์ตหมายเลข 5124 สามารถเข้าถึงได้จากใน Kubernetes Cluster เท่านั้น

กำหนดให้เซอร์วิสต่าง ๆ มี Image ดังนี้

- Site: Docker Image คือ babelcoder-accounting/site:1.0
- Revenue Cycle: Docker Image คือ babelcoder-accounting/revenue:1.0
- Tax Calculator: Docker Image คือ babelcoder-accounting/tax:1.0
- Report: Docker Image คือ babelcoder-accounting/report:1.0
- Email: Docker Image คือ babelcoder-accounting/email:1.0

กำหนดให้เซอร์วิสต่าง ๆ มีจำนวน Replicas ดังต่อไปนี้

- Site: มี 5 replicas
- Revenue Cycle: มี 3 replicas
- Tax Calculator: มี 2 replicas
- Report: มี 2 replicas
- Email: มี 3 replicas

จงสร้างไฟล์ YAML สำหรับการนิยาม Deployments และ Services ของเซอร์วิสทั้งหมดตามที่กล่าวมาแล้ว


