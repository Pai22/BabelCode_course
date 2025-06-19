## การใช้งาน Tarraform
เป็นเครื่องมือที่ทำหน้าทีในการ Config ค่าผ่านตัว Code เพื่อสร้างตัว infrastructure หรือระบบ server บน Cloud ของเรา

การพัฒนาแอปพลิเคชันมีเป้าหมายปลายทางอยู่ที่การนำส่งแอปพลิเคชันเหล่านั้นสู่ Production โดยนัยยะแล้วก็คือการส่งมอบผลิตภัณฑ์เพื่อใช้งานสู่เซิฟเวอร์นั่นเอง

การสร้างเซิฟเวอร์ขึ้นมาเพื่อใช้งานผ่าน Cloud Providers ต่าง ๆ เช่น AWS Azure หรือ Google Cloud ต่างต้องอาศัยการสร้างผ่านอินเตอร์เฟซที่มีการแสดงผลเป็น UI ผ่านเว็บ แม้จะมีรูปแบบการใช้งานที่ง่ายแต่ก็ยากในการทำซ้ำ เช่น หากต้องการสร้างเซิฟเวอร์ที่มีลักษณะเหมือนกันในครั้งถัดไปเราจำเป็นต้องทำการเข้าสู่อินเตอร์เฟซดังกล่าวแล้วทำการคลิกเพื่อเลือกเมนูต่าง ๆ อีกครั้ง เพื่อให้เกิดผลลัพธ์เป็นเซิฟเวอร์ที่มีคุณลักษณะตามที่เราต้องการ

Cloud Providers ส่วนใหญ่ได้จัดเตรียม API เพื่อให้นักพัฒนาเรียกใช้ API เหล่านี้สามารถเรียกเพื่อสร้างอินสแตนซ์ของเซิฟเวอร์ตามคุณลักษณะที่ต้องการได้ เราสามารถศึกษาชุดคำสั่งของ API จากชุดคู่มือที่ Cloud Providers นั้น ๆ ที่เราใช้บริการได้ แม้ว่า API เหล่านี้จะสามารถเขียนเป็นโค้ดเพื่อนำกลับมาใช้ซ้ำได้ แต่รูปแบบการเขียนเพื่อเรียกใช้ API นั้นค่อนข้างซับซ้อนยากต่อการทำความเข้าใจ อีกทั้งชุดของโค้ดที่เราพัฒนาเพื่อเรียกใช้ API นั้นไม่ได้สนใจสถานะปัจจุบันของเซิฟเวอร์ เช่น เราต้องการสร้างอินสแตนซ์ของเซิฟเวอร์จำนวน 2 ตัว แม้ว่าบน Cloud Providers นั้นเราจะสร้างอินสแตนซ์ไปแล้วจำนวน 1 ตัว แต่เมื่อทำการสั่งรันชุดของโค้ดนั้น ผลลัพธ์สุดท้ายก็ยังเป็นการสร้างอินสแตนซ์เพื่ออีกสองตัวอยู่ดี ทำให้ผลลัพธ์สุทธิเป็น 3 อินสแตนซ์เกิดกว่าที่เราคาดหวังไว้ สาเหตุที่เป็นเช่นนี้นั่นเพราะว่าชุดของโค้ดที่เราเขียนเพื่อใช้งาน API ส่วนใหญ่แล้วจะไม่ได้ทำการตรวจสอบก่อนว่าสถานะปัจจุบันมีอินสแตนซ์อยู่แล้วจำนวนเท่าใดนั่นเอง จากปัญหาดังกล่าวข้างต้นเราสามารถแก้ไขได้ด้วยหลักการของ Infrastructure as Code หรือ IaC

ก่อนที่เราจะรู้จักกับหลักการของ IaC เราจะเรียนรู้การสร้างเซิฟเวอร์ด้วยวิธีทั่วไปกันก่อน สำหรับบทเรียนนี้จะนำเสนอผ่านการสร้างเซิฟเวอร์ด้วย Digital Ocean

1. การสร้างเซิฟเวอร์แบบ VPS ด้วย **Digital Ocean**
URL:[DigitalOcean](https://www.digitalocean.com/?utm_medium=affiliates&utm_source=impact&utm_campaign=5843390&utm_content=&irgwc=1&irclickid=26qU8X2M3xycUKKQFXWM90G3UksR9myKHS-MSA0&gad_source=1&gad_campaignid=21599698028&gbraid=0AAAAA9nmATaKifesDvQXUMwBpw35kZkUN&gclid=CjwKCAjw3rnCBhBxEiwArN0QEySAjrhXEFGTXsFDNzTN_iiwl17N_0W563knlf3gau7ZZa1e5pJVzhoCzawQAvD_BwE)

Digital Ocean เป็นหนึ่งในบริการคลาวด์ที่ให้บริการทั้งการสร้างเซิฟเวอร์แบบ VPS การสร้างพื้นที่สำหรับการจัดเก็บข้อมูล และบริการอื่น ๆ อีกมาก เช่น ระบบคลัสเตอร์ของ Kubernetes ในที่นี้เราจะทำการสร้างเซิฟเวอร์ผ่านบริการสร้างที่เรียกว่า Droplets

Droplets คือเครื่องเสมือน (Virtual Machine) ที่ทำงานบนระบบปฏิบัติการ Linux แต่ละ Droplets จะเสมือนเป็นเครื่องเซิฟเวอร์ที่แยกจากกันในลักษณะของ VPS

เมื่อ Droplets มีลักษณะเป็นเซิฟเวอร์ เราจึงสามารถเข้าถึงเซิฟเวอร์นี้ได้ด้วย 2 วิธี คือการใช้ SSH และการใช้รหัสผ่าน ในที่นี้จะนำเสนอการเข้าถึงเซิฟเวอร์ด้วย SSH โดยเริ่มต้นจากการสร้าง SSH Keys ก่อนผ่านคำสั่งดังนี้ เมื่อ nthongjor คือชื่อของผู้ใช้งานปัจจุบันบนเครื่อง

```bash
$ ssh-keygen

Generating public/private rsa key pair.
Enter file in which to save the key (/home/nthongjor/.ssh/id_rsa): /home/nthongjor/.ssh/do_terraform
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/nthongjor/.ssh/do_terraform
Your public key has been saved in /home/nthongjor/.ssh/do_terraform.pub
The key fingerprint is:
SHA256:U1q3moz32e2ElwXZ7iI+d5qX6UxJlgJlN33Hkp09dIw nthongjor@LAPTOP-HEF902DE
The key's randomart image is:
+---[RSA 3072]----+
|             o.X=|
|            o E=@|
|          o.. o.=|
|
```
จากนั้นให้ทำการแสดง Public Key ดังกล่าวผ่านคำสั่ง cat แล้วจึงทำการคัดลอกค่าดังกล่าวไว้

```bash
$ cat /Users/PAI/.ssh/do_terraform # private key /home/nthongjor/.ssh/do_terraform

$ cat /Users/PAI/.ssh/do_terraform.pub # public key. /home/nthongjor/.ssh/do_terraform.pub

ssh-rsa xxxxxxxxxxxxxxxxxxxx
```

เข้าสู่ระบบของ Digital Ocean แล้วไปที่ Settings -> Security -> Add SSH Key

![add-ssh-key-menu](/DevOps_Course//Images/add-ssh-key-menu.png)

ทำการวาง Public Key ที่ได้คัดลอกไว้ไปวางในส่วนของ Public Key ของหน้าจอ Digital Ocean พร้อมกำกับ Key Name ว่า `do_terraform`

![add-ssh-key](/DevOps_Course//Images/add-ssh-key.png)
หากการทำงานสำเร็จเราจะพบกับ SSH Key ชื่อ `do_terraform` ดังภาพ

![ssh-key](/DevOps_Course//Images/ssh-key.png)
ลำดับถัดไปเราจะทำการสร้าง Droplet ตัวใหม่ในฐานะที่เป็นเซิฟเวอร์ของเรา ก่อนอื่นให้ทำการสร้างโปรเจคขึ้นมาใหม่โดยการคลิกเมนู Net Project

![new-project](/DevOps_Course//Images/new-project.png)
ทำการระบุค่าสำหรับการสร้างโปรเจค ดังนี้

- Name your project: terraform
- Add a description: A project to represent terraform demo
- Tell us what it's for: Web Application

![create-project](/DevOps_Course//Images/create-project.png)
เมื่อถึงหน้าจอของ Move Resources ให้ทำการเลือก Skip for now

![move-resources](/DevOps_Course//Images/move-resources.png)
เมื่อขั้นตอนของการสร้างโปรเจคเสร็จสิ้น การดำเนินการใด ๆ ต่อจากนี้จะกระทำอยู่บนโปรเจคดังกล่าวของเรา

ขั้นตอนถัดไปให้ทำการสร้าง Droplet โดยการเลือกเมนู Create -> Droplets

![create-droplet-menu](/DevOps_Course//Images/create-droplet-menu.png)
Digital Ocean นั้นมี Data Center หรือสถานที่สำหรับการจัดเก็บเซิฟเวอร์และข้อมูลให้บริการในหลายภูมิภาค ในที่นี้เราจะเลือกเป็น Singapore

![select-data-center](/DevOps_Course//Images/select-data-center.png)
Digital Ocean มีการจัดเตรียม Images ต่าง ๆ สำหรับนำมาสร้างเซิฟเวอร์ ไม่ว่าจะเป็น Linux เช่น Ubuntu หรือเป็น Images ประเภทที่มีแอปพลิเคชันติดตั้งพร้อมใช้งาน เช่น Docker ในที่นี้เราจะเลือกไปที่ Marketplace แล้วจึงใส่ docker ในช่องค้นหา สุดท้ายจึงทำการเลือก Image ที่มีชื่อขึ้นต้นว่า Docker ดังภาพ

![select-image](/DevOps_Course//Images/select-image.png)
ขั้นตอนถัดมาให้ทำการเลือกขนาดของ Droplet ในการเลือกขนาดนี้จะเป็นการระบุถึงจำนวนของ CPU Memory Disk และ Data Transfer สำหรับในบทเรียนนี้ให้เลือกเป็น Regular

![select-size](/DevOps_Course//Images/select-size.png)
เพื่อให้เราสามารถเข้าสู่เซิฟเวอร์ของเราได้ เราต้องทำการระบุวิธีในการเข้าถึงเซิฟเวอร์ เนื่องจากเรามีการสร้าง SSH Key และนำส่งสู่ Digital Ocean ไว้แล้ว เราจะใช้ SSH Key ดังกล่าวเป็นตัวอนุญาตให้เราเข้าถึงเซิฟเวอร์ของเราได้ จากหน้าจอนี้ให้ทำการเลือก SSH Key -> do_terraform

![choose-authentication-method](/DevOps_Course//Images/choose-authentication-method.png)
สุดท้ายให้ยืนยันขั้นตอนการสร้างด้วยการคลิกเลือก Create droplet

![finalize-details](/DevOps_Course//Images/finalize-details.png)
เมื่อขั้นตอนต่าง ๆ เสร็จสิ้นเราจะพบกับ Droplet ใหม่ที่มีชื่อว่า `terraform`

ลำดับถัดไปเราจะทำการทดสอบว่า Droplet ของเราสามารถใช้งานได้จริงและมี Docker ติดตั้งอยู่ภายในเซิฟเวอร์ ให้ทำการคัดลอก IP ของ Droplet แล้วจึงออกคำสั่งดังต่อไปนี้

```bash
$ ssh -i ~/.ssh/do_terraform root@[DROPLET_IP]

The authenticity of host '206.189.43.202 (206.189.43.202)' can't be established.
ED25519 key fingerprint is SHA256:C+HytWBXrD957ZKo4QGvYhcKRBn/kTm6gQm4eOxTJOg.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '206.189.43.202' (ED25519) to the list of known hosts.
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-94-generic x86_64)

* Documentation:  https://help.ubuntu.com
* Management:     https://landscape.canonical.com
* Support:        https://ubuntu.com/pro

  System information as of Wed Mar 27 11:45:50 UTC 2024
```
ทำการทดสอบว่ามี Docker ติดตั้งอยู่ภายในด้วยการออกคำสั่งนี้

```bash
$ docker info

Client: Docker Engine - Community
Version:    25.0.3
Context:    default
Debug Mode: false
Plugins:
  buildx: Docker Buildx (Docker Inc.)
    Version:  v0.12.1
    Path:     /usr/libexec/docker/cli-plugins/docker-buildx
  compose: Docker Compose (Docker Inc.)
    Version:  v2.17.2
    Path:     /root/.docker/cli-plugins/docker-compose
```

2. หลักการของ Infrastructure as Code
การสร้าง Droplets ดังปรากฎข้างต้นค่อนข้างยุ่งยากเนื่องจากต้องทำการเลือกเมนูต่าง ๆ บนหน้าเว็บเพื่อให้ได้ผลลัพธ์ตามต้องการ อีกทั้งการกระทำดังกล่าวไม่สามารถกระทำซ้ำได้โดยปราศจากการเริ่มต้นเลือกเมนูต่าง ๆ ใหม่อีกครั้งตั้งแต่ต้น

เพื่อแก้ไขปัญหาดังกล่าวเราจึงควรออกแบบการสร้าง Droplets ให้อยู่ในรูปแบบของโค้ดที่สามารถนำไปใช้ซ้ำได้ โดยส่วนของโค้ดดังกล่าวต้องมีคุณสมบัติที่ทำให้เราสามารถระบุจำนวน Droplets ที่ต้องการได้ด้วยและมีการตรวจสอบสถานะของจำนวน Droplets โดยอัตโนมัติด้วยตัวของมันเอง อีกสิ่งที่สำคัญคือชุดคำสั่งนั้นจะต้องสามารถบำรุงรักษาได้ง่ายด้วยการเพิ่มคุณสมบัติให้มีรูปแบบที่ง่ายต่อการอ่านเพื่อทำความเข้าใจ คุณสมบัติต่าง ๆ เหล่านี้คือสิ่งที่เรียกว่า **Infrastructure as Code**

Infrastructure as Code (IaC) คือวิธีในการจัดการและสร้างส่วนของ Infrastructure ผ่านไฟล์ที่มีรูปแบบโครงสร้างที่ง่ายต่อการทำความเข้าใจ โดยไฟล์ดังกล่าวจะมีลักษณะของการอธิบายถึงสถานะสุดท้ายที่ต้องการให้ระบบเป็น โดย IaC มีคุณสมบัติหลัก ดังนี้

  1. การจัดการ Infrastructure บน Cloud Providers เป็นไปอย่างอัตโนมัติ
  2. มีการควบคุมเวอร์ชันเพื่อบันทึกการเปลี่ยนแปลงของสิ่งที่เกิดขึ้นบน Cloud Providers
  3. การจัดการ Infrastructure เป็นไปอย่างมีประสิทธิภาพ
  4. สามารถนำการตั้งค่าไปใช้ซ้ำได้

คุณสมบัติและการแก้ไขปัญหาต่าง ๆ ตามที่ได้กล่าวมาข้างต้นสามารถกระทำเพื่อสร้างการทำงานแบบ IaC ได้ผ่านเครื่องมือที่ชื่อว่า Terraform

3. **Terraform** คืออะไร
Terraform เป็นเครื่องมือที่ใช้จัดการ **Infrastructure** อย่างปลอดภัยและมีประสิทธิภาพ โดยใช้ภาษาที่เรียกว่า HashiCorp Configuration Language (HCL) ที่สั้นและเข้าใจง่ายในการนิยามการทำงานซึ่งสามารถใช้จัดการ Cloud ได้เกือบทุกเจ้า รวมถึง Docker, Kubernetes, และอีกมากมายกว่า 200+ providers

Terraform มีความสามารถดังนี้:

  1. **จัดการ resources ด้วย configuration syntax ที่สั้นและเข้าใจง่าย**: สามารถกำหนดและจัดการกับ Infrastructure เช่น เซิร์ฟเวอร์, Network, และ Database ด้วยภาษา HCL (HashiCorp Configuration Language) โดยทีมนักพัฒนาสามารถกำหนดรายละเอียดโดยสร้าง Configuration Files และสามารถแก้ไขได้ตามต้องการ ⁴.
  2. **แสดงสิ่งที่กำลังจะทำ**: ก่อนที่จะมีการสร้าง/ลบ/แก้ไข resources จริงๆ เพื่อให้ทราบว่าจะมีการทำอะไรกับ Infrastructure บ้าง ช่วยลดโอกาสผิดพลาด
  3. **สร้าง resource-dependencies graph**: เพื่อจัดลำดับการสร้าง/ลบ/แก้ไข resources ได้อย่างมีประสิทธิภาพสูงสุด
  4. **รัน configuration ซ้ำได้เรื่อยๆ**: โดยที่ไม่ทำให้ resources เดิมมีปัญหา
  5. **ใช้จัดการ resources ได้แทบทุก platforms**
ส่วนประกอบหลักของ Terraform ประกอบด้วย Terraform Core Terraform State File และ Terraform Providers ดังนี้

![terraform-architecture](/DevOps_Course//Images/terraform-architecture.png)

### Terraform Core

Terraform Core หรือที่รู้จักกันในชื่อของ Terraform CLI เป็นโปรแกรมที่พัฒนาด้วยภาษา Go เป็นส่วนของอินเตอร์เฟสที่ให้ผู้ใช้งานสามารถติดต่อใช้งานในฐานะของ CLI เพื่อติดต่อกับ Terraform โดยมีส่วนของอินพุตสองอย่างที่ต้องนำส่งคือ ไฟล์การตั้งค่าของ Terraform ที่ลงท้ายนามสกุลด้วย `.tf` และอีกสิ่งหนึ่งคือไฟล์ที่บ่งบอกสถานะปัจจุบันของเครื่องเซิฟเวอร์ปลายทาง เรียกว่าไฟล์ **Terraform State**

### Terraform Providers

Terraform Providers เป็นโมดูลหรือปลั๊กอินที่ผู้ใช้งานสามารถนำมาใช้เพื่อให้เกิดการติดต่อไปยัง Cloud Providers ปลายทางได้ การทำงานของ Providers นั้นจะแปลงส่วนของการตั้งค่าที่อยู่ในไฟล์ให้เป็นการเรียกใช้งาน API ของ Cloud Providers ปลายทางแทน ดังนั้นหากเราต้องการจัดการโครงสร้างพื้นฐานของ AWS เราจะต้องทำการติดตั้งและประกาศการใช้งาน AWS Providers เพื่อให้ Terraform อ่านค่าการตั้งค่านั้นแล้วแปลงเป็นการเรียก API ของ AWS เพื่อทำการสร้างเซิฟเวอร์หรือทรัพยากรบน AWS ตามที่เราต้องการต่อไป

### Terraform State File

Terraform State File เป็นส่วนประกอบสำคัญของ Terraform มีหน้าที่ในการจัดเก็บสถานะปัจจุบันของทรัพยากรที่อยู่ในความดูแลของ Terraform เช่น เซิฟเวอร์ เป็นต้น โดยทำการจัดเก็บในรูปแบบของไฟล์ JSON ไฟล์ดังกล่าวนี้จะมีบทบาทอย่างยิ่งเมื่อเราออกคำสั่งต่าง ๆ ผ่าน CLI เช่น กรณีที่ไฟล์ตั้งค่า (นามสกุลลงท้ายด้วย .tf) มีการเปลี่ยนแปลง เช่น ทำการตั้งค่าเพื่อเพิ่มเซิฟเวอร์ใหม่ เมื่อการออกคำสั่งเกิดขึ้น Terraform จะทำการตรวจสอบสถานะปัจจุบันผ่าน Terraform State File ก่อนว่าปัจจุบันทรัพยากรบน Cloud Provider เป็นเช่นไรบ้าง หากการตั้งค่านั้นมีเพียงการเพิ่มเซิฟเวอร์ใหม่ Terraform จะแค่ทำการอัพเดทสถานะด้วยการเพิ่มเซิฟเวอร์ใหม่เท่านั้นโดยไม่ทำการยุ่งเกี่ยวใด ๆ กับเซิฟเวอร์เดิม เนื่องจากสถานะปัจจุบันที่ระบุใน State File ตรงกันกับค่าที่เราตั้งไว้ในไฟล์การตั้งค่าอยู่แล้ว

4. โครงสร้างของไฟล์การตั้งค่า Terraform
ไฟล์การตั้งค่า Terraform หรือ Terraform Configuration File เป็นไฟล์ที่ใช้ภาษา HCL ลงท้ายนามสกุลไฟล์ด้วย .tf ประกอบด้วยส่วนประกอบต่าง ๆ ดังนี้

### Terraform Block
ตามที่กล่าวมาข้างต้น Terraform เน้นไปที่การสร้าง Infrastructure บน Cloud Providers ดังนั้นสิ่งหนึ่งที่สำคัญคือการประกาศว่าเราต้องการใช้งาน Provider ใดโดยทำการอ้างอิงถึงปลั๊กอินของ Provider นั้น ๆ พร้อมระบุเวอร์ชันที่ต้องการใช้ เมื่อถึงเวลาออกคำสั่ง Terraform จะทำการดาวน์โหลดปลั๊กอินของ Provider ตามเลขเวอร์ชันดังกล่าวที่ระบุ

รูปแบบการประกาศ Providers จะนิยามไว้ในบลอคของ `terraform`

```
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}
```

### Provider Block

เมื่อต้องการใช้งาน Providers ใด เราระบุได้ผ่านบลอคของ terraform ดังกล่าวไปแล้วข้างต้น ตอนนี้ก็ถึงเวลาที่เราต้องทำการตั้งค่าเพิ่มเติมเพื่อให้สามารถเชื่อมต่อการทำงานไปยัง Providers นั้น ๆ ได้ กรณีของการตั้งค่านี้จะใช้บลอคของ `provider` ที่มีชื่อตรงกับ Cloud Providers ที่ใช้งาน

```
provider "digitalocean" {
  token = var.do_token
}
```

### Resource Block
ภายใต้ Cloud Providers หนึ่ง ๆ นั้นจะประกอบด้วยหลายบริการ เช่น กรณีของ AWS มีบริการต่าง ๆ มากมาย เช่น EC2 AKS RDS และอื่น ๆ การที่เราติดตั้งปลั๊กอิน Provider นั้นเป็นเพียงการบอกกล่าวว่าต้องการใช้งาน Cloud Provider เจ้าใด แต่ไม่ได้ทำการระบุว่าต้องการใช้ทรัพยากรหรือบริการใดใน Cloud Provider นั้น ๆ

เพื่อเป็นการระบุอย่างชัดเจนว่าต้องการใช้งานบริการหรือทรัพยากรใดบน Provider เราจึงต้องประกาศการใช้งานทรัพยากรนั้นในบลอคของ `resource` พร้อมระบุค่าต่าง ๆ เพื่อเป็นรายละเอียดในการสร้างทรัพยากรนั้นบน Cloud Provider ได้อย่างถูกต้อง

```
resource "digitalocean_droplet" "my-node" {
  image = "docker-20-04"
  name = "my-node"
  region = "sgp1"
  size = "s-1vcpu-1gb"
  ssh_keys = [
    data.digitalocean_ssh_key.terraform.id
  ]
}
```

### Data Block
ในบางครั้งบลอคของ resource อาจต้องการข้อมูลเพิ่มเติม เช่น กรณีของ Digital Ocean เพื่อให้เราสามารถเข้าถึง Droplet ที่สร้างขึ้นใหม่ได้ เราต้องทำการส่ง SSH Key ไปในตอนสร้าง Droplet ด้วย กรณีเช่นที่ว่านี้บลอคของ resource จึงจำเป็นต้องทราบว่าข้อมูลของ SSH Key นั้นคือสิ่งใด

สถานการณ์ดังกล่าวเราสามารถดึงค่าของ SSH Key ออกมาจาก Cloud Provider คือ Digital Ocean ได้ผ่านบลอคที่ชื่อว่า data บลอคดังกล่าวนี้ใช้เพื่อดึงค่าข้อมูลที่มีอยู่แล้วใน Cloud Provider ออกมาใส่ในชื่อตัวแปรที่กำหนด โดยมากแล้วเราจะอ้างอิงถึงตัวแปรนี้ภายหลังในบลอค resource เพื่อเป็นข้อมูลสำหรับการสร้างทรัพยากรที่ต้องการต่อไป
```
data "digitalocean_ssh_key" "terraform" {
  name = "do_terraform"
}
```
จากชุดการตั้งค่าด้านบนเราใช้ `digitalocean_ssh_ke`y เพื่อบอกว่าต้องการเข้าถึง SSH Key และตั้งชื่อให้ว่า `terraform` เมื่อเราต้องการเข้าถึง SSH Key ดังกล่าว เราสามารถอ้างอิงได้จาก `data.digitalocean_ssh_key.terraform`

Variable Block
หลายสถานการณ์ที่เราต้องการประกาศตัวแปรเพื่อนำไปใช้ซ้ำในตำแหน่งต่าง ๆ ของไฟล์ การประกาศตัวแปรนี้ให้ประกาศในบลอคของ variable

```
variable "do_token" {
    type = string
    description = "The DigitalOcean Personal Access Token"
    sensitive = true
}
```

จากการประกาศข้างต้นเราจะได้ตัวแปรชื่อ `do_token` ที่สามารถอ้างอิงได้ผ่าน `var.do_token`

ในการส่งค่าให้กับตัวแปรนั้น เราสามารถกระทำได้หลายวิธี เช่น

- ผ่าน CLI: กรณีนี้เราจะทำการแนบแฟล็คพิเศษคือ `-var <ชื่อตัวแปร>=<ค่าตัวแปร>` ไปพร้อมกับคำสั่ง terraform
- ผ่านไฟล์ Variable Definition: โดยการสร้างไฟล์ `terraform.tfvars` หรือไฟล์ที่ลงท้ายนามสกุลว่า `.auto.tfvars` เช่น `pipeline.auto.tfvars` พร้อมระบุชื่อและค่าของตัวแปรต่าง ๆ
- ผ่าน Environment Variables: โดยการกำหนดค่า Env ผ่านชื่อ `TF_VAR_<ชื่อตัวแปร>`

### Output Block
เป็นบลอคสำหรับการประกาศค่าที่ต้องการให้ Terraform ทำการส่งผลลัพธ์กลับคืนมา

```
output "droplet_ip" {
  value = digitalocean_droplet.my-node.ipv4_address
}
```

5. การสร้างไฟล์ตั้งค่า Droplets ด้วย Terraform
ก่อนอื่นเราต้องหาให้เจอก่อนว่าปลั๊กอินของ Terraform ที่ใช้กับ Cloud Provider เจ้านั้น ๆ มีชื่อว่าอย่างไร โดยการใช้ Google เช่น กรณีของ Digital Ocean เราสามารถค้นหาได้ด้วยคำว่า `digitalocean terraform`
URL: [digitalocean terraform](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs)

![search-for-terraform-provider](/DevOps_Course//Images/search-for-terraform-provider.png)
เมื่อทำการเข้าสู่หน้าเอกสารดังกล่าวจะพบกับวิธีการใช้งานของปลั๊กอินนั้น ๆ
![digitalocean-terraform](/DevOps_Course//Images/digitalocean-terraform.png)

ลำดับถัดมาให้ทำการสร้างไฟล์ `main.tf` โดยเริ่มต้นจากการประกาศบลอค `terraform` ด้วยการระบุ Provider ที่ต้องการใช้งานโดยอ้างอิงจากตัวอย่างการใช้ปลั๊กอินบนหน้าเว็บไซต์
```
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}
```

กรณีของ Digital Ocean การใช้งาน Terraform มีผลลัพธ์ให้เกิดการเรียกใช้ API โดยส่งไปยัง Digital Ocean เพื่อทำการสร้างทรัพยากรตามที่ระบุ การเข้าถึง API ของ Digital Ocean นั้นต้องแนบ **Personal Access Token (PAT)** ไปด้วย เพื่อให้ Digital Ocean ทราบว่าเราผู้กระทำการเรียกใช้ API นั้นคือใคร

สำหรับวิธีการสร้าง PAT นั้นให้ไปยังเมนู API แล้วเลือก Generate Access Token
![generate-token-ui](/DevOps_Course//Images/generate-token-ui.png)
หน้าเว็บไซต์จะแสดงหน้าต่าง New Personal access token ให้ทำการระบุ Token name เป็น terraform และเลือก Write (optional) สุดท้ายจึงกดปุ่ม Generate Token

![new-token-ui](/DevOps_Course//Images/new-token-ui.png)
หน้าจอจะแสดง Token ให้ทำการกดไอคอนข้าง Token เพื่อทำการคัดลอก Token ดังกล่าวเก็บเอาไว้

![show-token-ui](/DevOps_Course//Images/show-token-ui.png)
ทำการประกาศตัวแปรชื่อ `do_token` โดยเราจะทำการส่งค่าของ Token ที่สร้างเมื่อซักครู่ไปภายหลังเมื่อออกคำสั่งบน Terraform CLI

```tf
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

```
เพื่อให้การใช้งานทรัพยากรบน Provider เกิดขึ้นได้ เราต้องตั้งค่าบลอค `provider` สำหรับ Digital Ocean ต้องทำการส่ง PAT ไปด้วย

```tf

<!-- เพิ่ม -->
provider "digitalocean" {
  token = var.do_token
}
```

การสร้าง Droplet นั้นจะมีขึ้นตอนนึงที่เราต้องระบุ SSH Key เพื่อให้เราสามารถเข้าถึง Droplet ได้ในภายหลัง เราทราบดีอยู่แล้วว่าเราเคยสร้าง SSH Key บน Digital Ocean มาก่อนแล้วโดยใช้ชื่อว่า do_terraform เราจึงสามารถใช้บลอค data เพื่อเข้าถึงค่าที่มีอยู่แล้วบน Provider ได้ (เพิ่มต่อจากเมื่อกี้)

```
data "digitalocean_ssh_key" "terraform" {
  name = "do_terraform"
}
```
สุดท้ายจึงทำการสร้าง Droplet โดยระบุค่าต่าง ๆ ให้เหมือนกับตอนที่เราสั่งสร้างผ่านเว็บไซต์ (เพิ่มต่อจากเมื่อกี้)

```
resource "digitalocean_droplet" "my-node" {
  image = "docker-20-04"
  name = "my-node"
  region = "sgp1"
  size = "s-1vcpu-1gb"
  ssh_keys = [
    data.digitalocean_ssh_key.terraform.id
  ]
}
```
ก่อนหน้าที่เราจะสร้าง Droplet บนหน้า UI เราสร้างโปรเจคขึ้นมาก่อน สำหรับกรณีของ Terraform ก็สามารถใช้บลอค resource ในการสร้างโปรเจคขึ้นมาพร้อมระบุ Droplet ที่เราพึ่งสร้างให้เป็นส่วนหนึ่งของโปรเจคดังกล่าวได้ (เพิ่มต่อจากเมื่อกี้)

```
resource "digitalocean_project" "terraform" {
  name        = "terraform"
  description = "A project to represent terraform demo."
  purpose     = "Web Application"
  environment = "Production"
  resources = [
    "${digitalocean_droplet.my-node.urn}"
  ]
}
```

สุดท้ายเราต้องการผลลัพธ์เมื่อออกคำสั่ง Terraform ให้เป็นเลข IP ของ Droplet ที่พึ่งสร้าง เราจึงสร้างส่วนบลอค output ดังนี้ (เพิ่มต่อจากเมื่อกี้)
```
output "droplet_ip" {
  value = digitalocean_droplet.my-node.ipv4_address
}
```

6. Terraform Workflow
Terraform Workflow คือขั้นตอนปฏิบัติในการใช้งาน Terraform แบ่งออกเป็น 5 ขั้นตอนได้แก่ Write Init Plan Apply และ Destroy

- Write: Write หรือ Define คือขั้นตอนของการเขียนไฟล์การตั้งค่าของ Terraform โดยต้องนิยามบลอคต่าง ๆ ให้ครบถ้วน
- Init: เป็นขั้นตอนของการออกคำสั่ง `terraform init` มีผลให้เกิดการสร้างพื้นที่ของการทำงานที่เรียกว่า Terraform Workspace ในขั้นตอนนี้จะมีการสร้างโฟลเดอร์ชื่อ `.terraform` ขึ้นมาโดย Terraform จะทำการดาวน์โหลด Providers ต่าง ๆ ที่เรานิยามไว้นำมาใส่โฟลเดอร์นี้
- Plan: คำสั่ง `terraform plan` เป็นคำสั่งของขั้นตอนนี้ที่ Terraform จะมีการเชื่อมต่อกับ Cloud Providers ที่เรานิยามไว้ในไฟล์การตั้งค่าเพื่อตรวจสอบว่าทรัพยากรใดที่นิยามเอาไว้ที่ยังไม่มีอยู่บน Providers นั้น ๆ บ้าง แล้วจึงออกรายงานบนหน้าจอเพื่อให้ทราบว่าจะมีการเปลี่ยนแปลงใดเกิดขึ้นบ้างเมื่อ Terraform ได้รับการทำงาน ในขั้นตอนของ Plan จะยังไม่มีการเปลี่ยนแปลงทรัพยากรบน Providers แต่อย่างใด
- Apply: ขั้นตอนนี้เป็นขั้นตอนของคำสั่ง `terraform apply` ที่จะทำการสร้าง แก้ไข หรือเปลี่ยนแปลงทรัพยากรบน Cloud Providers ตราบใดที่ทรัพยากรบน Providers เหล่านั้นไม่ตรงกับที่นิยามในไฟล์การตั้งค่า โดยทั่วไปแล้วขั้นตอนของการ apply จะมีการเรียก plan ก่อนเพื่อให้เห็นว่าจะเกิดการเปลี่ยนแปลงใดบ้าง เมื่อผู้ใช้งานยอมรับการเปลี่ยนแปลงนั้นจึงเกิดการสร้างหรือแก้ไขทรัพยากรบน Providers ต่อไป
- Destroy: ขั้นตอนนี้เป็นขั้นตอนของการลบ Infrastructure ทั้งหลายที่ถูกจัดการด้วย Terraform
### 6.1 Write
ทำการสร้างไฟล์ต่อไปนี้ใน `main.tf`
```tf
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

variable "do_token" {
    type = string
    description = "The DigitalOcean Personal Access Token"
    sensitive = true
}

provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_ssh_key" "terraform" {
  name = "do_terraform"
}

resource "digitalocean_droplet" "my-node" {
  image = "docker-20-04"
  name = "my-node"
  region = "sgp1"
  size = "s-1vcpu-1gb"
  ssh_keys = [
    data.digitalocean_ssh_key.terraform.id
  ]
}

resource "digitalocean_project" "terraform" {
  name        = "terraform"
  description = "A project to represent terraform demo."
  purpose     = "Web Application"
  environment = "Production"
  resources = [
    "${digitalocean_droplet.my-node.urn}"
  ]
}

output "droplet_ip" {
  value = digitalocean_droplet.my-node.ipv4_address
}
```
กรณีที่ต้องการ format code ให้ออกคำสั่ง `terraform fmt `สำหรับการตรวจสอบว่าการตั้งค่านั้นเป็นไปอย่างถูกต้องหรือไม่สามารถใช้คำสั่ง `terraform validate` ได้

### 6.2 Terraform Init
เพื่อให้เกิดการสร้าง Terraform Workspace ให้ออกคำสั่งดังนี้

```bash
$ terraform init

Initializing the backend...

Initializing provider plugins...
- Finding digitalocean/digitalocean versions matching "~> 2.0"...
- Installing digitalocean/digitalocean v2.36.0...
- Installed digitalocean/digitalocean v2.36.0 (signed by a HashiCorp partner, key ID F82037E524B9C0E8)

Partner and community providers are signed by their developers.
If you'd like to know more about provider signing, you can read about it here:
https://www.terraform.io/docs/cli/plugins/signing.html

Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

จากขั้นตอนดังกล่าวเราจะพบโฟลเดอร์ชื่อ `.terraform` และ `.terraform.lock.hcl` เกิดขึ้นมา

ให้ทำการสร้างไฟล์ `.gitignore` ดังนี้

```gitignore
*.tfstate
*.tfstate.backup
*.tfstate.lock.info
.terraform/

```

### 6.3 Terraform Plan
เราจะออกคำสั่งเพื่อดูผลลัพธ์ว่าเมื่อ Terraform ทำงานจะเกิดการเปลี่ยนแปลงอย่างไรบน Cloud Provider บ้าง
```bash
$ terraform plan

var.do_token
  The DigitalOcean Personal Access Token

  Enter a value: [ระบุค่า PAT]

data.digitalocean_ssh_key.terraform: Reading...
data.digitalocean_ssh_key.terraform: Read complete after 1s [name=do_terraform]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # digitalocean_droplet.my-node will be created
  + resource "digitalocean_droplet" "my-node" {
      + backups              = false
      + created_at           = (known after apply)
      + disk                 = (known after apply)
      + graceful_shutdown    = false
      + id                   = (known after apply)
      + image                = "docker-20-04"
      + ipv4_address         = (known after apply)
      + ipv4_address_private = (known after apply)
      + ipv6                 = false
      + ipv6_address         = (known after apply)
      + locked               = (known after apply)
      + memory               = (known after apply)
      + monitoring           = false
      + name                 = "my-node"
      + price_hourly         = (known after apply)
      + price_monthly        = (known after apply)
      + private_networking   = (known after apply)
      + region               = "sgp1"
      + resize_disk          = true
      + size                 = "s-1vcpu-1gb"
      + ssh_keys             = [
          + "41417253",
        ]
      + status               = (known after apply)
      + urn                  = (known after apply)
      + vcpus                = (known after apply)
      + volume_ids           = (known after apply)
      + vpc_uuid             = (known after apply)
    }

  # digitalocean_project.terraform will be created
  + resource "digitalocean_project" "terraform" {
      + created_at  = (known after apply)
      + description = "A project to represent terraform demo."
      + environment = "Production"
      + id          = (known after apply)
      + is_default  = false
      + name        = "terraform"
      + owner_id    = (known after apply)
      + owner_uuid  = (known after apply)
      + purpose     = "Web Application"
      + resources   = (known after apply)
      + updated_at  = (known after apply)
    }

Plan: 2 to add, 0 to change, 0 to destroy.
Changes to Outputs:
  + droplet_ip = (known after apply)

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now
```

### 6.4 Terraform Apply
เพื่อให้เกิดการเปลี่ยนแปลงบน Cloud Provider ให้ออกคำสั่งต่อไปนี้
```bash
$ terraform apply

var.do_token
  The DigitalOcean Personal Access Token

  Enter a value: [ระบุค่า PAT]
data.digitalocean_ssh_key.terraform: Reading...
data.digitalocean_ssh_key.terraform: Read complete after 1s [name=do_terraform]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # digitalocean_droplet.my-node will be created
  + resource "digitalocean_droplet" "my-node" {
      + backups              = false
      + created_at           = (known after apply)
      + disk                 = (known after apply)
      + graceful_shutdown    = false
      + id                   = (known after apply)
      + image                = "docker-20-04"
      + ipv4_address         = (known after apply)
      + ipv4_address_private = (known after apply)
      + ipv6                 = false
      + ipv6_address         = (known after apply)
      + locked               = (known after apply)
      + memory               = (known after apply)
      + monitoring           = false
      + name                 = "my-node"
      + price_hourly         = (known after apply)
      + price_monthly        = (known after apply)
      + private_networking   = (known after apply)
      + region               = "sgp1"
      + resize_disk          = true
      + size                 = "s-1vcpu-1gb"
      + ssh_keys             = [
          + "41417253",
        ]
      + status               = (known after apply)
      + urn                  = (known after apply)
      + vcpus                = (known after apply)
      + volume_ids           = (known after apply)
      + vpc_uuid             = (known after apply)
    }

  # digitalocean_project.terraform will be created
  + resource "digitalocean_project" "terraform" {
      + created_at  = (known after apply)
      + description = "A project to represent terraform demo."
      + environment = "Production"
      + id          = (known after apply)
      + is_default  = false
      + name        = "terraform"
      + owner_id    = (known after apply)
      + owner_uuid  = (known after apply)
      + purpose     = "Web Application"
      + resources   = (known after apply)
      + updated_at  = (known after apply)
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

digitalocean_droplet.my-node: Creating...
digitalocean_droplet.my-node: Still creating... [10s elapsed]
digitalocean_droplet.my-node: Still creating... [20s elapsed]
digitalocean_droplet.my-node: Still creating... [30s elapsed]
digitalocean_droplet.my-node: Still creating... [40s elapsed]
digitalocean_droplet.my-node: Still creating... [50s elapsed]
digitalocean_droplet.my-node: Creation complete after 55s [id=413590999]
digitalocean_project.terraform: Creating...
digitalocean_project.terraform: Creation complete after 3s [id=7b0dda04-1f13-4f58-ac07-e716a2dc77cd]

Outputs:

droplet_ip = "152.42.168.29"
```
กรณีที่ต้องการดูค่า Output เป็นหลักสามารถออกคำสั่งได้ดังนี้

```bash
$ terraform output

droplet_ip = "152.42.168.29"
```
### 6.5 Terraform Destroy
เมื่อเราต้องการลบทรัพยากรต่าง ๆ บน Cloud Providers ที่ Terraform ดูแลอยู่ให้ออกคำสั่งดังนี้
```bash
$ terraform derstroy

var.do_token
  The DigitalOcean Personal Access Token

  Enter a value: [ระบุค่า PAT]

data.digitalocean_ssh_key.terraform: Reading...
data.digitalocean_ssh_key.terraform: Read complete after 1s [name=do_terraform]
digitalocean_droplet.my-node: Refreshing state... [id=413590999]
digitalocean_project.terraform: Refreshing state... [id=7b0dda04-1f13-4f58-ac07-e716a2dc77cd]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  # digitalocean_droplet.my-node will be destroyed
  - resource "digitalocean_droplet" "my-node" {
      - backups              = false -> null
      - created_at           = "2024-04-18T11:43:43Z" -> null
      - disk                 = 25 -> null
      - graceful_shutdown    = false -> null
      - id                   = "413590999" -> null
      - image                = "docker-20-04" -> null
      - ipv4_address         = "152.42.168.29" -> null
      - ipv4_address_private = "10.104.0.2" -> null
      - ipv6                 = false -> null
      - locked               = false -> null
      - memory               = 1024 -> null
      - monitoring           = false -> null
      - name                 = "my-node" -> null
      - price_hourly         = 0.00893 -> null
      - price_monthly        = 6 -> null
      - private_networking   = true -> null
      - region               = "sgp1" -> null
      - resize_disk          = true -> null
      - size                 = "s-1vcpu-1gb" -> null
      - ssh_keys             = [
          - "41417253",
        ] -> null
      - status               = "active" -> null
      - tags                 = [] -> null
      - urn                  = "do:droplet:413590999" -> null
      - vcpus                = 1 -> null
      - volume_ids           = [] -> null
      - vpc_uuid             = "791db56f-5a69-424f-8e1d-6963e42efad1" -> null
        # (1 unchanged attribute hidden)
    }

  # digitalocean_project.terraform will be destroyed
  - resource "digitalocean_project" "terraform" {
      - created_at  = "2024-04-18T11:44:37Z" -> null
      - description = "A project to represent terraform demo." -> null
      - environment = "Production" -> null
      - id          = "7b0dda04-1f13-4f58-ac07-e716a2dc77cd" -> null
      - is_default  = false -> null
      - name        = "terraform" -> null
      - owner_id    = 13740497 -> null
      - owner_uuid  = "8b2e5a23-891e-4f0e-82a8-61095f97e86f" -> null
      - purpose     = "Web Application" -> null
      - resources   = [
          - "do:droplet:413590999",
        ] -> null
      - updated_at  = "2024-04-18T11:44:37Z" -> null
    }

Plan: 0 to add, 0 to change, 2 to destroy.

Changes to Outputs:
  - droplet_ip = "152.42.168.29" -> null

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

digitalocean_project.terraform: Destroying... [id=7b0dda04-1f13-4f58-ac07-e716a2dc77cd]
digitalocean_project.terraform: Destruction complete after 3s
digitalocean_droplet.my-node: Destroying... [id=413590999]
digitalocean_droplet.my-node: Still destroying... [id=413590999, 10s elapsed]
digitalocean_droplet.my-node: Still destroying... [id=413590999, 20s elapsed]
digitalocean_droplet.my-node: Destruction complete after 22s
```
