# CI/CD Workshop
ในเวิร์กชอปนี้เราจะได้เรียนรู้การสร้างรูปแบบการทำงานบนหลักการของ CI / CD โดยแบ่งแยก Repositories ของ Git ออกเป็นสองส่วน ได้แก่

- app: เป็น Repository - สำหรับจัดเก็บซอร์จโค้ดและไฟล์ของแอปพลิเคชันหลัก
env: เป็น Repository สำหรับจัดเก็บโค้ดที่เกี่ยวข้องกับการวางโครงสร้าง Infrastructure การตั้งค่าบน Production และโค้ดอื่นใดที่เกี่ยวข้องกับการ Deploy แอปพลิเคชัน

1. การสร้าง Repositories
ให้ทำการสร้าง Repositories จำนวน 2 Repositories บน Github

Repository ตัวแรกให้ตั้งชื่อว่า `devops-quickstart-app`

![create-app-repo](/DevOps_Course//Images/create-app-repo.png)
Repository ตัวถัดมาให้ตั้งชื่อว่า `devops-quickstart-env`
![create-env-repo](/DevOps_Course//Images/create-env-repo.png)
ทำการสร้างโฟลเดอร์ในเครื่องตั้งชื่อว่า `devops-quickstart` โดยสร้างโฟลเดอร์ย่อย 2 โฟลเดอร์ชื่อ `app` และ `env`
![devops-quickstart-subrepos](/DevOps_Course//Images/devops-quickstart-subrepos.png)
ทำการดาวน์โหลดซอร์จโค้ดของ app และ env ตามลิงก์ข้างล่าง จากนั้นจึงทำการ unzip และวางไฟล์บนโฟลเดอร์ต่าง ๆ อย่างถูกต้อง
- app: [ดาวน์โหลด ](https://www.dropbox.com/scl/fi/jhkjkz9ybup2xhhktxrxc/app.zip?rlkey=46nr2dr1gg5ab4v0djx0b5aqc&e=1&st=w5vg9rit&dl=0)
- env: [ดาวน์โหลด](https://www.dropbox.com/scl/fi/s7r7mnqwmer2e3f03wzar/env.zip?rlkey=80uki61h6f7tem3kqbr7fc1vy&e=1&st=8gbklomz&dl=0)

>หากทำการใช้งาน WSL2 บน Windows การดาวน์โหลดไฟล์แล้วย้ายไปยัง WSL2 อาจพบไฟล์นามสกุล Zone.Identifier ให้ทำการลบโดยออกคำสั่ง `find / -type f -name "*:Zone.Identifier" -exec rm -f {} \;` คำสั่งนี้ให้ออกตรงบนเทอร์มินอลของ WSL

2. กำหนดการทำงานของขั้นตอน CI
สำหรับหัวข้อนี้เราจะพิจารณาโฟลเดอร์ app โฟลเดอร์ดังกล่าวประกอบด้วยโฟลเดอร์ย่อยคือ api และ site ซึ่งเป็นส่วนของซอร์จโค้ดที่เกี่ยวข้องกับการทำงานของ API และหน้าเว็บตามลำดับ

ส่วนแรกที่เราจะพิจารณาคือ เมื่อใดก็ตามที่มีการ push โค้ดบน Github เราจะต้องตรวจสอบว่าโค้ดของเรานั้นมีความถูกต้องมากน้อยเพียงใด โดยพิจารณาจากการทดสอบโปรแกรม การกระทำดังกล่าวเป็นขั้นตอนของ CI โดยได้จัดเตรียมไว้แล้วในไฟล์ชื่อ `.github/ci.yml`

![ci-flow](/DevOps_Course//Images/ci-flow.png)
ไฟล์ดังกล่าวประกอบด้วยโค้ดดังต่อไปนี้

```yml
name: CI
on: [push]
jobs:
  testing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
      - name: Install site dependencies
        run: cd site && npm ci
      - name: Test site
        run: cd site && npm test
      - name: Setup Go 1.21.x
        uses: actions/setup-go@v4
        with:
          go-version: "1.21.x"
      - name: Install api dependencies
        run: cd api && go mod download
      - name: Test api
        run: cd api && go test ./...
```
>ไฟล์ที่อยู่ภายใต้โฟลเดอร์ของ .github จะถูกพิจารณาให้เป็น [Github Workflow ](https://docs.github.com/en/actions/writing-workflows/about-workflows)

3. กำหนดการทำงานของขั้นตอน Continuous Delivery
เมื่อใดก็ตามที่โค้ดของเราถูก push เข้า branch main นั่นแปลว่าโค้ดชุดนั้นจะต้องถูกนำส่งไปยัง Production ในขั้นตอนนี้ของ Repository app จะทำการสร้าง Docker Image ขึ้นมาโดยนำไปวางบน Docker Registry เช่น Docker Hub

ให้ทำการสมัครสมาชิกของ [Docker Hub](https://hub.docker.com/repositories/paisrp) จากนั้นทำการเลือกปุ่ม `Create Repository`

![create-repository-button](/DevOps_Course//Images/create-repository-button.png)
จากนั้นจึงใส่ชื่อเป็น `devops-quickstart-api` แล้วจึงกดปุ่ม Create

![create-api-image](/DevOps_Course//Images/create-api-image.png)
จากนั้นให้ทำซ้ำด้วยการสร้างใหม่เป็น `devops-quickstart-site` ดังนี้

![create-site-image](/DevOps_Course//Images/create-site-image.png)
ในการสร้าง Docker Image บน Docker Hub นั้น Github จะต้องมีสิทธิ์ในการเข้าถึง Docker Hub ก่อน เราจึงต้องทำการสร้าง Token แล้วนำส่ง Token นี้สู่ Github ต่อไป

ในขั้นตอนนี้ให้ไปที่เมนู My Profile บน Docker Hub
![docker-hub-my-profile](/DevOps_Course//Images/docker-hub-my-profile.png)
จากนั้นเลือก Edit Profile

![docker-hub-edit-profile](/DevOps_Course//Images/docker-hub-edit-profile.png)
ทำการเลือกแท็บ Security แล้วจึงกดปุ่ม New Access Token

![docker-hub-security](/DevOps_Course//Images/docker-hub-security.png)
เมื่อปรากฎหน้าจอ New Access Token ให้ทำการระบุ Access Token Description ว่า `Github Actions`

![docker-hub-create-token](/DevOps_Course//Images/docker-hub-create-token.png)
ทำการคัดลอก Token ที่ระบุสร้างให้

![docker-hub-copy-token](/DevOps_Course//Images/docker-hub-copy-token.png)
จากนั้นไปที่ Repository `devops-quickstart-app` แล้วจึงเลือก Settings

![github-settings](/DevOps_Course//Images/github-settings.png)
ทำการเลือกเมนู Secrets and variables -> Actions แล้วจึงกดปุ่ม New repository secret

![github-new-secret](/DevOps_Course//Images/github-new-secret.png)
ทำการระบุค่า `DOCKERHUB_USERNAME` ให้มีค่าเท่ากับ username ของ Docker Hub แล้วจึงกดปุ่ม Add secret

![github-secret-dockerhub-username](/DevOps_Course//Images/github-secret-dockerhub-username.png)
ทำซ้ำด้วยการสร้าง Secret ใหม่ ในรอบนี้ให้ระบุค่า `DOCKERHUB_TOKEN` เป็น Token ที่ได้คัดลอกไว้แล้วจาก Docker Hub

![github-secret-dockerhub-token](/DevOps_Course//Images/github-secret-dockerhub-token.png)
ขั้นตอนถัดไปเป็นส่วนของการแก้ไข CD Workflow โดยเปิดไฟล์ `.github/cd.yml`

![app-cd-workflow](/DevOps_Course//Images/app-cd-workflow.png)
ต่อไปนี้เป็นโค้ดของ `.github/cd.yml`

```yml
name: CD
on:
  push:
    branches:
      - main
jobs:
  push_to_registry:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME  }}
          password: ${{ secrets.DOCKERHUB_TOKEN  }}

      - name: Read Config
        id: config
        run: |
          echo "site_version=$(cat ./site/version)" >> "$GITHUB_OUTPUT"
          echo "api_version=$(cat ./site/version)" >> "$GITHUB_OUTPUT"

      - name: Build and push API
        uses: docker/build-push-action@v5
        with:
          context: ./api
          push: true
          tags: babelcoder/intro-to-devops-api:${{steps.config.outputs.api_version}}

      - name: Build and push Site
        uses: docker/build-push-action@v5
        with:
          context: ./site
          push: true
          tags: babelcoder/intro-to-devops-ui:${{steps.config.outputs.site_version}}
```

ให้ทำการค้นหา `babelcoder/intro-to-devops-ui` เพื่อแก้ไขให้เป็นชื่อ `[DOCKERHUB_ACCOUNT]/devops-quickstart-site` เช่น `babelcoder/devops-quickstart-site` และทำการค้นหา `babelcoder/intro-to-devops-api` เพื่อแก้ไขให้เป็นชื่อ `[DOCKERHUB_ACCOUNT]/devops-quickstart-api` เช่น `babelcoder/devops-quickstart-api`

ทำการเปิดไฟล์ `api/version` แล้วจึงทำการแก้ไขเลขเวอร์ชันเป็น 1.0 จากนั้นจึงทำการเปิดไฟล์ `site/version` แล้วจึงทำการแก้ไขเลขเวอร์ชันเป็น 1.0

4. นำส่งการทำงานของ Continuous Integration / Delivery
เมื่อทุกอย่างพร้อมแล้วเราจะนำโค้ดของ app ขึ้นสู่ Github โดยใช้คำสั่งต่อไปนี้

```bash
git init
git add -A
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:[ชื่อ organization หรือ account]/devops-quickstart-app.git
git push -u origin main
```
เมื่อเสร็จเรียบร้อยให้กลับไปที่หน้าจอของ app repository บน Github แล้วไปที่ Actions จะพบกับ Workflow ที่กำลังทำงานอยู่ ในที่นี้คือ CI และ CD
![github-actions](/DevOps_Course//Images/github-actions.png)
ทำการกดเลือกเข้าไปยัง Workflow ตัวใดตัวหนึ่ง ในที่นี้คือ CD จะเจอกับ Jobs ที่กำลังทำงานอยู่
![github-jobs](/DevOps_Course//Images/github-jobs.png)
เมื่อคลิกเข้าไปใน Job จะเจอรายละเอียดการทำงาน

![github-jobs-details](/DevOps_Course//Images/github-jobs-details.png)
หากการทำงานของ Workflows เสร็จสิ้นจะแสดงเป็นสีเขียว ดังนี้

![github-actions-success](/DevOps_Course//Images/github-actions-success.png)
ให้ทำการกลับไปที่ Docker Hub เพื่อดูผลลัพธ์ว่าได้มีการสร้าง Image พร้อมนำส่งแล้วหรือไม่ หากกระบวนการทำงานเสร็จสิ้นจะพบ Tag คือ 1.0

![docker-deploy-success](/DevOps_Course//Images/docker-deploy-success.png)

5. กำหนดการทำงานของขั้นตอน Continuous Deployment
ส่วนของการ Deploy นั้นเราจะกระทำบน env Repository เมื่อใดก็ตามที่มีการ push โค้ดเข้าสู่ branch main ให้กระทำสิ่งต่อไปนี้

1. ใช้ Terraform ตรวจสอบสถานะปัจจุบันของ Cloud Providers แล้วจึงทำการแก้ไขหรือเปลี่ยนแปลงต่อไป
2. ทำการ Deploy Docker Image ไปยัง Cloud Provider แล้วสั่งให้ทำงาน
การทำงานของ Github Workflow นั้นไม่สามารถจัดเก็บไฟล์ State ของ Terraform ได้ ด้วยเหตุนี้เราจะใช้บริการ Terraform Cloud เพื่อให้สามารถจัดเก็บไฟล์ State ภายใต้บริการดังกล่าวได้

สมัครใช้บริการ Terraform Cloud ได้ที่ [นี่](https://app.terraform.io/session) เมื่อสมัครใช้งานเสร็จสิ้นเรียบร้อยแล้ว จะเจอกับหน้าจอให้ทำการสร้าง Organization หน้าจอนี้ให้ทำการระบุชื่อเป็น `devops-quickstart`

![terraform-create-organization](/DevOps_Course//Images/terraform-create-organization.png)
หน้าจอจะเปลี่ยนไปแล้วจึงเจอกับเมนูสำหรับการสร้าง Workspaces ให้ทำการเลือก Create a workspace

![terraform-create-workspace-button](/DevOps_Course//Images/terraform-create-workspace-button.png)
ทำการเลือกไปที่ API-Driven Workflow
![terraform-api-driven](/DevOps_Course//Images/terraform-api-driven.png)
ทำการระบุชื่อของ Workspace เป็น github-actions
![terraform-create-workspace](/DevOps_Course//Images/terraform-create-workspace.png)
เมื่อทำการสร้าง Workspace เสร็จเรียบร้อยจะเจอกับหน้าจอนี้
![terraform-create-workspace-success](/DevOps_Course//Images/terraform-create-workspace-success.png)
Terraform Cloud จะเป็นคนจัดการรัน Terraform และจัดเก็บไฟล์ State ดังนั้นแล้ว Terraform Cloud จะต้องเชื่อมต่อกับ DigitalOcean ได้ เราจึงต้องทำการเพิ่มตัวแปร `do_token` ไปยัง Terraform Cloud โดยไปที่เมนู Variables

![terraform-do-token-menu](/DevOps_Course//Images/terraform-do-token-menu.png)
ทำการระบุชื่อ Key เป็น `do_token` พร้อมระบุค่า Token ลงไปแล้วเลือก Sensitive ก่อนที่จะกดปุ่ม Add variable
![terraform-create-do-token](/DevOps_Course//Images/terraform-create-do-token.png)
เพื่อให้ Github Workflow สามารถเข้าถึง Terraform Cloud ได้ เราจะต้องทำการสร้าง Access Token จากระบบของ Terraform Cloud เพื่อนำมาระบุใน Github Workflow ต่อไป

ให้ทำการเลือกที่รูปโปรไฟล์แล้วไปที่ Account Settings

![terraform-account-settings](/DevOps_Course//Images/terraform-account-settings.png)
จากนั้นจึงทำการเลือกเมนู Token -> Create an API token

![terraform-create-token-menu](/DevOps_Course//Images/terraform-create-token-menu.png)
ทำการใส่คำอธิบายเป็น Github Actions แล้วเลือก Generate token

![terraform-generate-token](/DevOps_Course//Images/terraform-generate-token.png)
ทำการคัดลอก Token ที่ได้จากหน้าจอสุดท้าย
![terraform-token](/DevOps_Course//Images/terraform-token.png)
ทำการเข้าสู่หน้าจอของ Github ในส่วนของ env repository แล้วจึงเลือกไปที่เมนู Settings -> Secrets and variables -> Actions

![github-env-repo-add-secret](/DevOps_Course//Images/github-env-repo-add-secret.png)
แล้วเลือกเมนู New repository secret จากนั้นทำการระบุส่วนของชื่อเป็น TF_API_TOKEN พร้อมกับใส่ค่า Key ที่คัดลอกจาก Terraform Cloud ลงไปในช่อง Secret แล้วจึงกดปุ่ม Add Secret
![github-env-repo-add-terraform-secret](/DevOps_Course//Images/github-env-repo-add-terraform-secret.png)
ทำซ้ำอีกครั้งโดยรอบนี้ให้ทำการสร้าง `SSH_KEY` โดยทำการคัดลอกมาจาก `cat ~/.ssh/do_terraform`
![github-env-repo-ssh-key-secret](/DevOps_Course//Images/github-env-repo-ssh-key-secret.png)

ส่วนถัดมาเราจะทำการแก้ไขโค้ดให้ถูกต้อง โดยเปิดไฟล์ `docker-compose.yml` ให้ทำการค้นหา `babelcoder/intro-to-devops-ui:2.0` เพื่อแก้ไขให้เป็นชื่อ `[DOCKERHUB_ACCOUNT]/devops-quickstart-site:1.0` เช่น `babelcoder/devops-quickstart-site:1.0` และทำการค้นหา `babelcoder/intro-to-devops-api` เพื่อแก้ไขให้เป็นชื่อ `[DOCKERHUB_ACCOUNT]/devops-quickstart-api` เช่น `babelcoder/devops-quickstart-api`

6. นำส่งการทำงานของ Countinuous Deployment
เมื่อทุกอย่างพร้อมแล้วเราจะนำโค้ดของ env ขึ้นสู่ Github โดยใช้คำสั่งต่อไปนี้
```bash
git init
git add -A
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:[ชื่อ organization หรือ account]/devops-quickstart-env.git
git push -u origin main
```
เมื่อเสร็จเรียบร้อยให้กลับไปที่หน้าจอของ env repository บน Github แล้วไปที่ Actions จะพบกับ Workflow ที่กำลังทำงานอยู่ ในที่นี้คือ CD

![env-deployment-job](/DevOps_Course//Images/env-deployment-job.png)
หากต้องการ destroy บน Terraform Cloud ให้ไปที่เมนู Settings -> Destruction and Deletion จากนั้นเลือก Queue destroy plan

![terraform-queue-destroy-plan](/DevOps_Course//Images/terraform-queue-destroy-plan.png)
เมื่อมีป็อบอัพเด้งขึ้นมาให้ระบุค่าเป็น github-actions
![terraform-queue-destroy-github-actions](/DevOps_Course//Images/terraform-queue-destroy-github-actions.png)
ส่วนนี้ให้รอจนกว่า terraform plan จะทำงานเสร็จ เมื่อเสร็จสิ้นให้ทำการ confirm

![terraform-destroy](/DevOps_Course//Images/terraform-destroy.png)
เมื่อทุกอย่างเสร็จสิ้น Infrastructure ที่ถูกจัดการโดย Terraform ก็จะถูกลบออกไป
