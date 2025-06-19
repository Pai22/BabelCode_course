# Datadog

## Logging
การ log ข้อมูลไม่ได้ log ผ่าน terminal แต่จะ log แล้วไปเก็บอยู่ที่นึงที่เป็นตัวสำหรับการจัดเก็บ log เพื่อที่จะสามารถมาดูทีหลังได้

## Tracing
เป็นตัวที่บอกว่ามี request มาที่ path ไหนบ้าง แล้วก็เวลาเข้ามาที่ path นั้นมีการดำเนินการหรือว่าทำอะไรต่อไป

## Monitoring
คอยสอดส่องดูทรัพยากรต่างๆ เช่น cpu ของเราเป็นลักษณะแบบไหน, memmory เป็นลักษณะอย่างไร หรือเราสามารถตั้งค่า trad hold ได้ถ้าเกิดเปิด CPU เกิน 20% ให้มีการ alert มา

โดยสามอย่างนี้มี software ที่ใช้คือ [Elastic stack](https://www.elastic.co/kibana และ [Grafana](https://grafana.com/grafana/dashboards/) สำหรับ dashboard หรือ [datadog](https://www.datadoghq.com/)





![](/DevOps_Course//Images/.png)