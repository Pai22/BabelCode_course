# Kubernetes
1. Container Orchestration
แม้ว่าตอนนี้เราจะสามารถใช้งานคอนเทนเนอร์ผ่าน Docker ได้แล้ว ทว่าการใช้งานจริงบน Production ยังถือว่าการสร้างและใช้งานเฉพาะคอนเทนเนอร์นั้นไม่เพียงพอ นั่นเพราะความซับซ้อนของการใช้งานจริงไม่สามารถแก้ไขได้เพียงแค่การใช้คอนเทนเนอร์เท่านั้น เช่น ทำอย่างไรจึงจะสามารถ Scale คอนเทนเนอร์ขึ้นมาหลายตัวได้อย่างอัตโนมัติเพื่อรองรับโหลดของผู้ใช้งานเมื่อทรัพยากรถึงขีดจำกัดที่กำหนด หรือเราจะสามารถจัดการการเชื่อมต่อเน็ตเวิร์กของคอนเทนเนอร์ที่หลากหลายได้อย่างไร เป็นต้น ปัญหาต่าง ๆ เหล่านี้สามารถแก้ไขได้ด้วย Container Orchestration

Container Orchestration เป็นกระบวนการที่ใช้เทคโนโลยีอัตโนมัติในการจัดการวงจรชีวิตของคอนเทนเนอร์ ซึ่งรวมถึงการจัดสรรทรัพยากร การปรับขนาด (ขยายและย่อ) การจัดการเครือข่าย และการดูแลความพร้อมใช้งาน. การจัดการคอนเทนเนอร์ด้วยการปรับใช้อัตโนมัติ โดยสนับสนุนทีม DevOps ให้เกิดการใช้งานในกระบวนการของ CI/CD

เครื่องมือที่ใช้ในการจัดการคอนเทนเนอร์มีหลากหลาย ซึ่ง Kubernetes เป็นเครื่องมือที่ได้รับความนิยมมากที่สุด และมีการให้บริการ Kubernetes ที่จัดการโดยคลาวด์จากผู้ให้บริการคลาวด์ชั้นนำหลายแห่ง เช่น Amazon Web Services (AWS), Google Cloud Platform, IBM Cloud และ Microsoft Azure

สถาปัตยกรรม Kubernetes ประกอบด้วยส่วนต่างๆ ดังนี้:
  - 1. Control Plane: หัวใจของ Kubernetes Cluster ที่ควบคุมการทำงานทั้งหมด ส่วนนี้ประกอบด้วย:

    -kube-apiserver: เป็นหน้าตาของ Kubernetes Control Plane รวม API ให้เรียกใช้งานเพื่อจัดการคำขอจากภายในระบบ Cluster และภายนอกระบบ Cluster
    -kube-scheduler: ตรวจสอบสภาพความพร้อมของ Cluster และกำหนดการทำงานของ Pod ให้กับ Node ที่เหมาะสม
    -kube-controller-manager: ประกอบด้วยฟังก์ชัน Controller หลาย ๆ อย่างที่จัดการการทำงานของ Cluster การทำงานของ Kubernetes นั้นจะมีการตรวจสอบทรัพยากรปัจจุบันว่ามีสถานะเป็นเช่นไร (Current State) Controller Manager จะพยายามเปลี่ยนแปลงสถานะปัจจุบันให้เป็นสถานะที่ต้องการ (Desired State)
    -Cloud Controller Manager: ส่วนนี้ใช้เพื่อติดต่อกับ Cloud Provider API เพื่อจัดการให้เกิดการสร้างหรือใช้งานทรัพยากรบน Cloud Provider นั้น
    -etcd: เป็นตัวจัดเก็บข้อมูลในลักษณะของ key-value โดยจะทำการจัดเก็บสถานะที่ต้องการให้ Cluster เป็น (Desired State) Controller Manager จะเป็นผู้อ่านค่าข้อมูลนี้เพื่อนำไปวิเคราะห์ว่าต้องปรับเปลี่ยนทรัพยากรใน Cluster อย่างไรเพื่อให้มีจำนวนทรัพยากรหรือสถานะเป็นไปตามที่ต้องการ
  - 2. Nodes: เป็นเครื่อง Linux® ที่สามารถเป็นเครื่องจริงหรือเครื่องเสมือน (VM) แต่ละ Node จะทำการรัน Pods ที่ประกอบด้วย Containers ส่วนนี้ประกอบด้วย:

    - kubelet: รับคำสั่งจาก scheduler แล้วจึงติดต่อกับ Container Runtime เพื่อสั่งรันคอนเทนเนอร์ตามคำสั่งที่ได้รับมา
    - kube-proxy: เป็นส่วนสำคัญสำหรับระบบเน็ตเวิร์กใน Cluster โดยมีหน้าที่ทำให้เกิดการเชื่อมต่อผ่านเน็ตเวิร์กได้
  - 3. Pods: ประกอบด้วย Containers ที่ทำงานร่วมกันและแบ่งปันทรัพยากร

สถาปัตยกรรม Kubernetes นี้ช่วยให้สามารถจัดการการทำงานของ Containers ได้อย่างมีประสิทธิภาพและยืดหยุ่น
![k8s-architecture](/DevOps_Course//Images/k8s-architecture.png)

2. Pods
Pods เป็นทรัพยากรพื้นฐานใน Kubernetes โดย Pod ใน Kubernetes คือกลุ่มของ Containers ที่มีทรัพยากรที่ใช้ร่วมกัน Pod เป็นหน่วยที่เล็กที่สุดที่สามารถสร้างและจัดการได้ใน Kubernetes ภายในระบบ Kubernetes Containers ใน Pod เดียวกันจะแบ่งปันทรัพยากรการคำนวณเดียวกัน

Pods ใน Kubernetes Cluster มีการใช้งานในสองแบบหลัก:

  - 1. Pods ที่รัน Container เดียว ในกรณีนี้ภายใต้ Pod หนึ่ง ๆ จะมีเพียงหนึ่งคอนเทนเนอร์ที่ทำงานอยู่ โดย Kubernetes จะจัดการ Pod แทนการจัดการ Containers โดยตรง แม้จะมีเพียงหนึ่งคอนเทนเนอร์ใน Pod ก็ตาม
  - 2. Pods ที่รันหลาย Containers ที่ต้องทำงานร่วมกัน Pod สามารถรวมแอปพลิเคชันที่ประกอบด้วย Containers หลายๆ ตัวที่ตั้งอยู่ร่วมกันและต้องแบ่งปันทรัพยากรภายใน Pod เดียวกันได้
เราจะทำการสร้าง Pod ขึ้นมาจาก Docker Image คือ `babelcoder/intro-to-devops-ui:1.0` โดยตั้งชื่อ Pod ว่า site ผ่านคำสั่งต่อไปนี้
```
kubectl run site --image=babelcoder/intro-to-devops-ui:1.0
```
ทำการออกคำสั่งเพื่อดูรายการ Pods ที่ปรากฎใน Kubernetes ได้ดังนี้
```bash
$ kubectl get pod

NAME   READY   STATUS    RESTARTS   AGE
site   1/1     Running   0          2m1s
```
จะพบว่ามี Pod ชื่อ site ทำงานอยู่ 1 ตัว (1/1 แปลว่าทั้งหมดมี 1 instance และทำงานทั้งหมด)

ลำดับต่อไปเราจะออกคำสั่งเพื่อให้สามารถเข้าถึง Pod ด้านในผ่านเน็ตเวิร์กได้
```bash
$ kubectl port-forward site 5151:80

Forwarding from 127.0.0.1:5151 -> 80
Forwarding from [::1]:5151 -> 80
```

![pod](/DevOps_Course//Images/pod.png)
คำสั่งนี้จะทำให้เราสามารถเข้าถึงพอร์ต 80 ใน Pod ชื่อ site ได้โดยเข้าถึงผ่าน `127.0.0.1:5151`

![port-forward](/DevOps_Course//Images/port-forward.png)
3. Multi-Container Design Patterns
ด้วยคุณสมบัติของ Pod ที่สามารถมีหลายคอนเทนเนอร์ทำงานอยู่ภายในและใช้งานทรัพยากรร่วมกัน จึงเกิดรูปแบบการสร้าง Pod ที่หลากหลายตามแต่ปัญหาที่ต้องการจัดการ

#### 3.1 Init Containers
![init-containers](/DevOps_Course//Images/init-containers.png)
รูปแบบนี้เป็นการให้มีคอนเทนเนอร์ตัวหนึ่งใน Pod มีหน้าที่เป็นตัวสร้างค่าเริ่มต้น เช่นอาจเป็นการสร้างค่าพิเศษ หรือเป็นการสร้างไฟล์ เช่น index.html เพื่อจัดเตรียมเนื้อหาให้พร้อมก่อนการเริ่มทำงาน เมื่อเตรียมค่าข้อมูลแล้วจึงส่งต่อค่าข้อมูลนี้ไปให้คอนเทนเนอร์หลักใน Pod เป็นผู้รับค่าที่สร้างนี้ไปทำงานต่อ

#### 3.2 Ambassador Pattern
![ambassador](/DevOps_Course//Images/ambassador.png)
รูปแบบนี้เป็นการสร้างตัวแทนในฐานะ Proxy เพื่อรับช่วงต่อการทำงานมาจากคอนเทนเนอร์หลักแล้วจึงส่งต่อการทำงานไปยังส่วนอื่น เช่น คอนเทนเนอร์หลักของเราเขียนวิธีการติดต่อกับฐานข้อมูลไว้ด้วย URL คือ `localhost:6379` ทว่า Redis ซึ่งเป็นส่วนของฐานข้อมูลทำงานอยู่ใน Pod อื่นจึงไม่สามารถเข้าถึงได้โดยตรงโดยใช้ `localhost` หากแต่ต้องอ้างอิงจากชื่อของ Service (ในที่นี้คือ redis) การเรียนใช้งานที่ถูกต้องจึงควรเป็น `redis:6379` อย่างไรก็ตามเราไม่ต้องการแก้ไขซอร์จโค้ดใหม่จึงทำการสร้างอีหนึ่งคอนเทนเนอร์ในฐานะ Proxy ที่คอนเทนเนอร์หลักเมื่อส่ง Request มาเป็น `localhost:6379` จะถูก Proxy แปลงและส่งต่อไปยัง `redis:6379` อีกทีนึง

#### 3.3 Sidecar Pattern
![sidecar](/DevOps_Course//Images/sidecar.png)
รูปแบบนี้เป็นการใส่คอนเทนเนอร์เพิ่มใน Pod เพื่อขยายหน้าที่อื่นที่ไม่ได้สัมพันธ์โดยตรงกับงานหลักของคอนเทนเนอร์หลักใน Pod เช่น การมีอยู่ของคอนเทนเนอร์เพื่อทำหน้าที่ในการรวบรวม Log ก่อนส่งไปจัดเก็บยังส่วนอื่นต่อไป

#### 3.4 Adapter Pattern
![adapter](/DevOps_Course//Images/adapter.png)
รูปแบบนี้เป็นการขยายความสามารถมาจาก Sidecar Pattern โดยมีหน้าที่หลักเพื่อเป็นตัวแปลง (Adapter) เช่น ทำการแปลง Log ให้อยู่ในรูปแบบมาตรฐานก่อนนำไปจัดเก็บ เป็นต้น

4. Deployments
การสร้าง Pods ขึ้นมาโดยตรงผ่านคำสั่ง `kubectl run `ไม่มีประสิทธิภาพเพียงพอเนื่องจากคำสั่งดังกล่าวไม่มีตัวควบคุม Pod ว่าเมื่อ Pod ตายแล้วจะต้องมีการสร้าง Pod ใหม่ขึ้นมาทดแทน ในหลักการของ Kubernates จึงมีตัวควบคุมที่เรียกว่า ReplicaSet

ReplicaSet เป็นทรัพยากรสำหรับควบคุมจำนวน Pod และการสร้าง Pod โดยเราสามารถระบุส่วนของ `replicas` ในไฟล์ YAML ได้เพื่อเป็นสถานะของจำนวน Pod ที่ต้องการ เมื่อใดก็ตามที่ Pod ในการควบคุมของ ReplicaSet หายไป ReplicaSet จะทำการสร้าง Pod ทดแทนจนกว่าจะครบจำนวนตามที่ระบุใน `replicas`

การใช้งานจริงจะไม่ได้ใช้งาน ReplicaSet โดยตรง หากแต่จะใช้ผ่านตัวควบคุมที่เรียกว่า Deployments ที่ทำหน้าที่ในการควบคุม ReplicaSet อีกชั้นนึง
![deployment-replicaset-pods](/DevOps_Course//Images/deployment-replicaset-pods.png)
เพื่อให้ ReplicaSet ทราบว่า Pods ใดอยู่ในความควบคุมของมัน เราจึงต้องการการกำหนเค่า Label แล้วนำไปแปะในแต่ละ Pod ผ่าน `labels`
```
template:
    metadata:
        labels:
            app: site <!--  ✅บรรทัดนี้ -->
```
ส่วนของโค้ดข้างต้นเป็นการกำหนดว่า เมื่อใดก็ตามที่ Pod ถูกสร้างโดย ReplicaSet ให้มี Label เป็น `app=site `ส่วนถัดมาที่เราต้องทำคือการกำหนดให้ ReplicaSet รู้ว่า Label ใดคือสิ่งที่มันควบคุมโดยการอาศัยการระบุผ่าน `matchLabels`
```
spec:
    replicas: 3
    selector:
        matchLabels:
            app: site
```
![labels](/DevOps_Course//Images/labels.png)
เพียงเท่านี้ ReplicaSet ก็สามารถตรวจสอบสถานะของ Pods ตามค่า Label ที่สนใจได้แล้ว

5. Services
การเชื่อมต่อผ่านเน็ตเวิร์กไปยัง Pod หากเชื่อมต่อโดยการใช้ IP ของ Pods โดยตรงย่อมนำมาซึ่งปัญหา เช่น หาก Pods เดิมตาย ReplicaSet ท่ำการสร้าง Pods ใหม่ขึ้นมาทดแทนสิ่งนี้ก็จะทำให้ IP เปลี่ยนแปลงไปด้วย การเรียกใช้งานผ่าน IP ที่เคยใช้ได้ก่อนหน้าก็จะไม่สามารถใช้งานได้อีกเพราะ IP เปลี่ยนค่าไปแล้ว อีกปัญหาหนึ่งคือถ้าเราอยู่นอกระบบ Cluster ของ Kubernetes เราจะไม่สามารถเข้าถึง Pods ผ่านเน็ตเวิร์กได้โดยตรง อย่างไรก้ตามปัญหาดังกล่าวนั้นสามารถแก้ไขได้ด้วย Services

Services ใน Kubernetes เป็นวิธีการเปิดเผยแอปพลิเคชันเครือข่ายที่กำลังทำงานในรูปแบบของ Pods หนึ่งหรือมากกว่าในคลัสเตอร์ของเรา Services ใน Kubernetes จะมีการจดจำค่า Endpoints ซึ่งเป็นค่า IP/Port ของ Pods ปลายทาง เมื่อเราทำการเชื่อมต่อด้วยการเรียกผ่าน Services ตัว Services จึงสามารถส่งต่อการทำงานไปยัง Pods ปลายทางผ่าน Endpoints ได้

Services สามารถแบ่งการใช้งานออกเป็นหลายประเภท ดังนี้

#### 5.1 Cluster IP
Cluster IP เป็นค่าเริ่มต้นของ Services ใน Kubernetes ในกรณีที่เราไม่ได้เลือกรูปแบบเป็นอย่างอื่น Cluster IP นั้นจะเป็น Services ประเภทที่สามารถเรียกใช้งานได้เฉพาะใน Cluster เท่านั้น โดย Cluster IP จะทำการเก็บ Endpoints เป็น IP/Port ของ Pods ปลายทางใน Cluster โดยไม่สนว่า Pods นั้นจะอยู่ใน Node ใด

วิธีการตั้งค่า Cluster IP นั้น สามารถสร้างเป็นไฟล์ YAML ได้ โดยให้ระบุส่วนของ ports ได้แก่ `port` คือพอร์ตของ Services ที่รับการติดต่อ และ `targetPort` คือพอร์ตของคอนเทนเนอร์ปลายทาง
```
apiVersion: v1
kind: Service
metadata:
  labels:
    app: db
  name: db
spec:
<!-- ---------- -->
  ports:
    - port: 6379
      protocol: TCP
      targetPort: 6379
<!-- ----------------- -->
  selector:
    app: db
```
![cluster-ip](/DevOps_Course//Images/cluster-ip.png)
เราจะทดลองการทำงานของ Cluster IP โดยการสร้าง Pod ผ่าน Image คือ busybox ดังนี้
```bash
$ kubectl run busybox --rm --restart Never -it --image=busybox
```
การเรียกใช้งาน Services ใน Cluster และ Namespace เดียวกัน สามารถอ้างอิงจากชื่อของ Service ได้โดยตรง

```bash
/  # telnet db 6379

Connected to db
```

กรณีของตัวอย่างข้างต้น เป็นการเรียกผ่านชื่อ db ซึ่งเป็นชื่อของ Services เมื่อได้รับการเรียก Services ดังกล่าวจะทำการตรวจสอบ Endpoints ที่มีอยู่แล้วจึงเลือกหนึ่งในนั้นเป็นปลายทางของการส่ง Request ต่อไป

#### 5.2 Node Port
การใช้งาน Cluster IP นั้นสามารถเข้าถึงได้เฉพาะภายใน Cluster เท่านั้น หากต้องการให้โลกภายนอกสามารถเข้าถึง Services ได้ด้วยเราจะใช้ Node Port

การตั้งค่า Node Port ผ่านไฟล์ YAML นั้นจะมีลักษณะที่คล้ายกับ Cluster IP หากแต่ต้องมีการระบุ `type` เป็น `NodePort`

![node-port](/DevOps_Course//Images/node-port.png)
เมื่อมีการใช้งาน Node Port สิ่งที่เกิดขึ้นคือจะมีการสร้าง Cluster IP Service ตามมาด้วย ต่อมา Kubernetes จะทำการสุ่มพอร์ตให้กับ Node Port (ค่าระหว่าง 30000 - 32767) สมมติให้ค่าพอร์ตที่สุ่มได้คือ 32074 เมื่อมี Request ส่งมายัง `<NODE_IP>:32074` Node Port จะส่งต่อการทำงานไปยัง Cluster IP ที่พอร์ต 5152 โดย Cluster IP จะส่งต่อไปปลายทางคือ Pods ที่พอร์ต 3000
![node-port-cmd](/DevOps_Course//Images/node-port-cmd.png)

#### 5.3 Load Balancer
แม้ว่า Node Port จะอยุญาตให้เราสามารถเข้าถึง Pods ปลายทางจากนอกระบบ Cluster ได้แต่ก็ยังมีข้อเสียอย่างหนึ่งคือเราต้องติดต่อผ่าน IP ของ Node ใด Node หนึ่ง ปัญหาส่วนนี้สามารถแก้ไขได้ด้วยการมี Load Balancer มีครอบทับอีกชั้นหนึ่ง เมื่อเป็นเช่นนี้คราใดก็ตามที่มีการร้องขอข้อมูลเราจะทำการติดต่อไปยัง Load Balancer แทน โดย Load Balancer จะมีการสร้าง Node Port ขึ้นมาอีกชั้นนึงเพื่อรับการทำงานที่ถูกส่งต่อมา

ในการตั้งค่า Load Balancer จะมีความคล้ายกับ Node Port เพียงแต่ต้องมีการระบุ `type` เป็น `LoadBalancer`
```
apiVersion: v1
kind: Service
metadata:
  labels:
    app: site
  name: site
spec:
  ports:
    - port: 5151
      protocol: TCP
      targetPort: 80
  selector:
    app: site
    <!-- ------------ -->
  type: LoadBalancer
    <!-- ------------ -->
```
![load-balancer](/DevOps_Course//Images/load-balancer.png)
สมมติให้ Node Port มีพอร์ตที่สุ่มได้คือ 30575 เมื่อมีการร้องขอข้อมูลไปยัง `<CLUSTER_IP>:5151` จะส่งต่อไปยัง Node Port ที่พอร์ต 30575 ต่อไป
![load-balancer-cmd](/DevOps_Course//Images/load-balancer-cmd.png)
6. ConfigMap
กรณีของการใช้งาน Docker Compose เพื่อรันเซอร์วิสต่าง ๆ นั้น เราสามารถส่ง Runtime Environment ผ่าน `environment` ได้ ดังนี้
```
version: "3.9"
services:
  api:
    image: babelcoder/intro-to-devops-api:1.0
    ports:
      - 5152:3000
      <!-- --------------- -->
    environment:
      - DATABASE_URL=redis://db:6379
      - PORT=3000
      - APP_ENV=production
      <!-- --------------- -->
```
อย่างไรก็ตามเมื่อแปลงการใช้งานดังกล่าวมาสู่ Kubernetes เราต้องใช้ทรัพยากรที่เรียกว่า ConfigMap เพื่อจัดการงานดังกล่าว

ConfigMap เป็นวิธีการจัดเก็บข้อมูลที่ไม่เป็นความลับ (ถ้าข้อมูลเป็นความลับจะต้องจัดเก็บผ่าน Secrets) โดยมีลักษณะเป็น key-value เราสามารถจัดเก็บค่าคอนฟิค หรืออาจจะเป็น Environment Variables ก็ได้

จากตัวอย่างของ docker-compose.yml ข้างต้น เราจะทำการสร้าง ConfigMap ที่มีชื่อว่า `api-config` ดังนี้

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
<!-- --------- -->
  databaseUrl: "redis://db:6379"
  port: "3000"
  env: "production"
<!-- --------- -->
```
จากนั้นจึงโหลดข้อมูลใน ConfigMap ไปใช้งานต่อใน Pod ดังนี้

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: babelcoder/intro-to-devops-api:1.0
          <!-- ---------------------- -->
          env:
            - name: DATABASE_URL
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: databaseUrl
            - name: PORT
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: port
            - name: APP_ENV
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: env
          <!-- ---------------------- -->
```
![config-map](/DevOps_Course//Images/config-map.png)
