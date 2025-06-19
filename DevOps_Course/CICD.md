# CI / CD
CI/CD ย่อมาจาก Continuous Integration และ Continuous Delivery/Deployment เป็นกลุ่มของหลักการปฏิบัติในการกระบวนการพัฒนาและส่งมอบซอฟต์แวร์อย่างอัตโนมัติ

Continuous Integration (CI) เป็นหลักปฏิบัติที่ทำให้สามารถเปลี่ยนแปลงซอร์จโค้ดได้บ่อยตามต้องการ เนื่องจากรวมหลักปฏิบัติที่ดีแบบอัตโนมัติไว้ในขั้นตอนของ CI เช่น การทดสอบซอฟต์แวร์แบบอัตโนมัติ เป็นต้น ขั้นตอนดังกล่าวจึงช่วยให้การเปลี่ยนแปลงซอร์จโค้ดผ่านการ Merge Code เกิดขึ้นได้บ่อยเท่าที่ต้องการ โดยลดความเป็นกังวลด้านความน่าเชื่อถือของซอฟต์แวร์ลงด้วยการทดสอบแบบอัตโนมัตินั่นเอง

Continuous Delivery/Deployment (CD) เป็นขั้นตอนที่กล่าวถึงการรวมความเปลี่ยนแปลงของโค้ดเข้ากับการทดสอบแล้วจึงทำการส่งมอบโค้ดที่เปลี่ยนแปลงนั้นออกเป็นแอปพลิเคชันต่อไป Continuous Delivery นั้นจะเป็นขั้นตอนที่รวมถึงการ built การทดสอบแบบอัตโนมัติ และการเตรียมความพร้อมสำหรับการ Deploy สู่ Production โดยการนำส่งสู่ Production นี้ขึ้นอยู่กับการตัดสินใจซึ่งอาจจะอยู่ในรูปแบบของการ Manual Deploy ในขณะที่ Continuous Deployment จะเป็นขั้นตอนแบบอัตโนมัติทั้งหมดที่โค้ดทุกส่วนที่เปลี่ยนแปลงและได้รับการทดสอบแบบอัตโนมัติแล้วจะถูกนำส่งสู่ Production โดยอัตโนมัติ

![cicd](/DevOps_Course//Images/cicd.png)

1. สร้างการทำงาน CI ด้วย Github Actions
Github Actions คือแพลตฟอร์มสำหรับการสร้างการทำงานแบบ Continuous Integration (CI) และ Continuous Delivery (CD) เพื่อสร้างการทำงานแบบอัตโนมัติสำหรับการ build, test และ deploy ในรูปแบบของขั้นตอนการทำงานหรือที่เรียกว่า Workflow โดยอาศัยการผูกความสัมพันธ์กับเหตุการณ์ (Event) ที่เกิดขึ้น เช่น ให้เกิดการทำ CI เมื่อมีการ push หรือเมื่อเกิด pull request เป็นต้น

ต่อไปนี้เป็นตัวอย่างโค้ดของ Continuous Integration (CI) ด้วย Github Actions ผ่านการสร้างไฟล์ `.github/workflows/ci.ym`l ที่จะมีการทำงานตามขั้นตอน `steps` ดังแสดงไว้ในไฟล์ทุกครั้งที่มีการ push code

```yml
name: CI
on: [push]
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
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
2. การสร้างการทำงานแบบ Continuous Delivery ด้วย Github Actions
ต่อไปนี้เป็นโค้ดสำหรับการ Build Docker และ push Image สู่ Docker Hub เมื่อมีการ push โค้ดเข้า main

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

3. การสร้างการทำงานแบบ Continuous Deployment ด้วย Github Actions
ต่อไปนี้เป็นตัวอย่างของโค้ดที่จะทำการรัน Terraform และ docker compose เมื่อมีการ push โค้ดเข้า main
```yml
name: CD
on:
  push:
    branches:
      - main
env:
  TF_CLI_CONFIG_FILE: "./.terraformrc"
jobs:
  deployment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3

      - name: Setup Terraform Config File
        id: terraform-config
        run: |-
          cat > .terraformrc <<EOF
          credentials "app.terraform.io" {
            token = "${{ secrets.TF_API_TOKEN }}"
          }
          EOF

      - name: Terraform Init
        id: init
        run: TF_CLI_CONFIG_FILE=${{env.TF_CLI_CONFIG_FILE}} terraform init

      - name: Terraform Validate
        id: validate
        run: terraform validate -no-color

      - name: Terraform Plan
        id: plan
        run: TF_CLI_CONFIG_FILE=${{env.TF_CLI_CONFIG_FILE}} terraform plan -no-color

      - name: Terraform Apply
        id: apply
        run: TF_CLI_CONFIG_FILE=${{env.TF_CLI_CONFIG_FILE}} terraform apply -auto-approve -no-color

      - name: Terraform Output
        id: output
        run: terraform output | sed -r 's/.+"([0-9,\.]+)"/ip=\1/' >> "$GITHUB_OUTPUT"

      - name: Check SSH Port Alive
        id: check-ssh-alive
        run: |
          while ! nc -z ${{ steps.output.outputs.ip }} 22; do
            sleep 1
            echo "port not response"
          done

      - name: Read Config
        id: config
        run: |
          docker_content=$(cat ./docker-compose.yml)
          echo "docker_content<<EOF" >> "$GITHUB_OUTPUT"
          echo "$docker_content" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"

          kong_content=$(cat ./kong/kong.yml)
          echo "kong_content<<EOF" >> "$GITHUB_OUTPUT"
          echo "$kong_content" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"

      - name: Deploy
        id: deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ steps.output.outputs.ip }}
          username: root
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker compose down

            rm -f ./docker-compose.yml

            mkdir -p ./kong
            cat > ./kong/kong.yml <<EOF
            ${{steps.config.outputs.kong_content}}
            EOF
            cat > ./docker-compose.yml <<EOF
            ${{steps.config.outputs.docker_content}}
            EOF

            docker compose up -d
```
