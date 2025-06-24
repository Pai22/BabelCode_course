# Gin Framework
เรียนรู้การใช้งาน Gin Framework เพื่อสร้าง API

- สร้าง module โดยใช้คำสั่ง `go mod init restful-api-gin` (restful-api-gin is name module) จะได้ไฟล์ `go.mod` 

- import gin framwork [ที่นี่](https://github.com/gin-gonic/gin) แล้วสร้าง `routes`

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default() // สร้าง gin.Default เป็น server

	r.GET("/", func(ctx *gin.Context) { // create routes
		ctx.String(http.StatusOK, "Hello, World") // http.StatusOK return เป็น 200
	})

	r.Run()
}


```

เสร็จแล้วทำการรัน main.go แล้วไปที่[port:8080](http://127.0.0.1:8080/)

```bash
$ go run main.go                                                   1 ✘ 
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /                         --> main.main.func1 (3 handlers)
[GIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.
Please check https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies for details.
[GIN-debug] Environment variable PORT is undefined. Using port :8080 by default
[GIN-debug] Listening and serving HTTP on :8080
[GIN] 2025/06/19 - 15:07:37 | 200 |      49.708µs |       127.0.0.1 | GET      "/"
[GIN] 2025/06/19 - 15:07:38 | 200 |      19.459µs |       127.0.0.1 | GET      "/"
```

เมื่อมีการ update โค้ดจะต้องมีการรันใหม่ สามารถแก้ไขปัญหาได้ด้วยการลง [air](https://github.com/air-verse/air) ที่ git hub ด้วยคำสั่ง `go install github.com/air-verse/air@latest` พอโหลด package เรียบร้อยจะออกคำสั่ง `$ air` มันจะทำการ start server ก็จะสามารถแก้ไขโค้ดแล้วมันจะ build ใหม่แล้วรันเอง

# RESTful API
- เรียนรู้หลักการออกแบบ และการทำงานของเว็บเซอร์วิสแบบ RESTful
- ตั้งอยู่บนสถาปัตยกรรมแบบ client server คือ มี client เข้าไปติดต่อขอรับบริการจาก server 
- RESTful API มองว่าฝั่ง server เป็นผู้ถือครองทรัพยากรและ client ต้องการขอรับบริการจาก server เพิื่อเข้าถึงทรัพยากร
- การที่ client ต้องการเข้าถึง server เพื่อเข้าถึงทรัพยากรจะต้องทราบว่าต้องเข้าถึงทรัพยากรตัวไหน เราจะใช้ URL เป็นตัวระบุ
- เข้าไปทำอะไรนั้นจะใช้ HTTP VERBS
- server จะตอบกลับมาแบบ Mime type และ HTTP STATUD CODES

### HTTP VERBS
- GET ดึงข้อมูล
- POST สร้างข้อมูลใหม่
- PUT 
- PATCH update ข้อมูลบางส่วน
- DELETE ต้องการลบ

### MIME-TYPES
- HTML text/html
- XML application/xml
- JSON application/json

### HTTP STATUD CODES
| Code | Status                    |
|------|---------------------------|
| 1xx  | Informational responses   |
| 2xx  | Success                   |
| 3xx  | Redirection               |
| 4xx  | Client Errors             |
| 5xx  | Server Errors             |

# Grouping Routes
เรียนรู้หลักการรวมกลุ่มของ Routes ที่สัมพันธ์กันตาม Feature ผ่าน Group
- แยก `routes` ออกมาจาก main.go สร้างโฟลเดอร์ `/routes` ใหม่

```GO
package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type article struct {
	Title string
	Body  string
}

func Serve(r *gin.Engine) {
	articles := []article{
		{Title: "Title#1", Body: "Body#1"},
		{Title: "Title#2", Body: "Body#2"},
		{Title: "Title#3", Body: "Body#3"},
		{Title: "Title#4", Body: "Body#4"},
		{Title: "Title#5", Body: "Body#5"},
	}
	articlesGroup := r.Group("/api/v1/articles")
	articlesGroup.GET("", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"articles": articles})
	})

	articlesGroup.GET("/:id", func(ctx *gin.Context) {
		ctx.String(http.StatusOK, "Hello, Pai")
	})

}

```

# การทดสอบ API ด้วย Postman
เรียนรู้การใช้โปรแกรม Postman เพื่อทดสอบ RESTful API

![postman](/RestfulAPI_with_go/course-go/images/postman.png)

# Query และ Params (GET)
เรียนรู้การดึงข้อมูลจาก QueryString และค่าพารามิเตอร์จาก Path ที่รับเข้ามา

- ต้องการขอข้อมูล (limit) 3 ตัว GET `http://127.0.0.1:8080/api/v1/articles?limit=3`
- จัดการกับ parameter GET `http://127.0.0.1:8080/api/v1/articles/1`
```go
package routes

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type article struct {
	ID    uint
	Title string
	Body  string
}

func Serve(r *gin.Engine) {
	articles := []article{
		{ID: 1, Title: "Title#1", Body: "Body#1"},
		{ID: 2, Title: "Title#2", Body: "Body#2"},
		{ID: 3, Title: "Title#3", Body: "Body#3"},
		{ID: 4, Title: "Title#4", Body: "Body#4"},
		{ID: 5, Title: "Title#5", Body: "Body#5"},
	}
	// limit
	articlesGroup := r.Group("/api/v1/articles")
	articlesGroup.GET("", func(ctx *gin.Context) {
		// ถ้าไม่มีการส่ง limit เข้ามาจะส่ง result กลับไป ก็คือส่ง articles ไปทั้งหมด
		result := articles
		if limit := ctx.Query(("limit")); limit != "" { // return is string
			n, _ := strconv.Atoi(limit) // string to int

			result = result[:n] // มี limit จะเลือกเอาตั้งแต่ตัวแรกจนถึงตัวที่ limit
		}
		ctx.JSON(http.StatusOK, gin.H{"articles": result})
	})

	// จัดการ parameter
	articlesGroup.GET("/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id")) // string to int

		for _, item := range articles {
			if item.ID == uint(id) {
				ctx.JSON(http.StatusOK, gin.H{"article": item})
				return
			}
		}
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
	})

}

```

# Form และการตรวจสอบข้อมูลในฟอร์ม (POST)
เรียนรู้การสร้างฟอร์มและส่งข้อมูลฟอร์มแบบ JSON ผ่านไคลเอนต์ รวมถึงการอ่านข้อมูลจากฟอร์มและการตรวจสอบข้อผิดพลาดในฟอร์ม

- สร้าง struct สำหรับ crate ใน feild ตอนส่งมา title อาจเป็นตัวเล็กเลยต้องทำการ map โดยใช้ `json` และมีการทำ validator โดยการใส่ tag `binding` สามารถดูตัวอย่างการใช้ validator ได้จาก[ที่นี่](https://github.com/go-playground/validator/blob/master/_examples/simple/main.go)

```go
package routes

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type article struct {
	ID    uint   `json:"id"` // ส่งออกชื่อไปแสดงเป็นตัวเล็ก
	Title string `json:"title"`
	Body  string `json:"body"`
}

type createArticleForm struct {
	// map and validator
	Title string `json:"title" binding:"required"` // binding: "required is ต้องใส่เข้ามาทุกครั้ง
	Body  string `json:"body" binding:"required"`
}

func Serve(r *gin.Engine) {
	articles := []article{
		{ID: 1, Title: "Title#1", Body: "Body#1"},
		{ID: 2, Title: "Title#2", Body: "Body#2"},
		{ID: 3, Title: "Title#3", Body: "Body#3"},
		{ID: 4, Title: "Title#4", Body: "Body#4"},
		{ID: 5, Title: "Title#5", Body: "Body#5"},
	}
	articlesGroup := r.Group("/api/v1/articles")
	articlesGroup.GET("", func(ctx *gin.Context) {
		// ถ้าไม่มีการส่ง limit เข้ามาจะส่ง result กลับไป ก็คือส่ง articles ไปทั้งหมด
		result := articles
		if limit := ctx.Query(("limit")); limit != "" { // return is string
			n, _ := strconv.Atoi(limit) // string to int

			result = result[:n] // มี limit จะเลือกเอาตั้งแต่ตัวแรกจนถึงตัวที่ limit
		}
		ctx.JSON(http.StatusOK, gin.H{"articles": result})
	})

	// จัดการ parameter
	articlesGroup.GET("/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id")) // string to int

		for _, item := range articles {
			if item.ID == uint(id) {
				ctx.JSON(http.StatusOK, gin.H{"article": item})
				return
			}
		}
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
	})

	articlesGroup.POST("", func(ctx *gin.Context) {
		var form createArticleForm
		if err := ctx.ShouldBindJSON(&form); err != nil { // ShouldBindJSON การ validate ข้อมูล
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		a := article{
			ID:    uint(len(articles) + 1),
			Title: form.Title,
			Body:  form.Body,
		}

		articles = append(articles, a)

		ctx.JSON(http.StatusCreated, gin.H{"article": a}) // retuen ออก client
	})

}
```

# Form Data และการอัพโหลดไฟล์
เข้าใจการส่งข้อมูลแบบ form data ผ่านไคลเอนต์ การอัพโหลดไฟล์พร้อมบันทึกไฟล์ลงโฟลเดอร์

- สร้่างโฟลเดอร์โดยการออกคำสั่งผ่าน `package os` ได้
- ในระบบปติบัติการตระกูล lunix และ unix จะมีเรื่องของ Permissions ที่บอกว่าจะมีเรื่องของการอ่าน เขียน และก็ excute ไฟล์ ต้องมีการกำหนดตัวเลขสามารถดูได้จาก(ที่นี่)[https://rubendougall.co.uk/projects/permissions-calculator/]

- ทำให้ JSON ส่งรูปภาพไปได้ โดยต้องส่งเป็น form-data

![Image form](/RestfulAPI_with_go/course-go/images/imageForm.png)

```go
package routes

import (
	"mime/multipart"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

type article struct {
	ID    uint   `json:"id"` // ส่งออกชื่อไปแสดงเป็นตัวเล็ก
	Title string `json:"title"`
	Body  string `json:"body"`
	Image string `json:"image"`
}

type createArticleForm struct {
	// map and validator
	Title string                `form:"title" binding:"required"` // binding: "required is ต้องใส่เข้ามาทุกครั้ง
	Body  string                `form:"body" binding:"required"`
	Image *multipart.FileHeader `form:"image" binding:"required"`
}

func Serve(r *gin.Engine) {
	articles := []article{
		{ID: 1, Title: "Title#1", Body: "Body#1"},
		{ID: 2, Title: "Title#2", Body: "Body#2"},
		{ID: 3, Title: "Title#3", Body: "Body#3"},
		{ID: 4, Title: "Title#4", Body: "Body#4"},
		{ID: 5, Title: "Title#5", Body: "Body#5"},
	}
	articlesGroup := r.Group("/api/v1/articles")
	articlesGroup.GET("", func(ctx *gin.Context) {
		// ถ้าไม่มีการส่ง limit เข้ามาจะส่ง result กลับไป ก็คือส่ง articles ไปทั้งหมด
		result := articles
		if limit := ctx.Query(("limit")); limit != "" { // return is string
			n, _ := strconv.Atoi(limit) // string to int

			result = result[:n] // มี limit จะเลือกเอาตั้งแต่ตัวแรกจนถึงตัวที่ limit
		}
		ctx.JSON(http.StatusOK, gin.H{"articles": result})
	})

	// จัดการ parameter
	articlesGroup.GET("/:id", func(ctx *gin.Context) {
		id, _ := strconv.Atoi(ctx.Param("id")) // string to int

		for _, item := range articles {
			if item.ID == uint(id) {
				ctx.JSON(http.StatusOK, gin.H{"article": item})
				return
			}
		}
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
	})

	articlesGroup.POST("", func(ctx *gin.Context) {
		var form createArticleForm
		if err := ctx.ShouldBind(&form); err != nil { // ShouldBind validate ข้อมูลแบบ form-data
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		a := article{
			ID:    uint(len(articles) + 1),
			Title: form.Title,
			Body:  form.Body,
		}

		// Get file หาไฟล์ดึงไฟล์ออกมาให้ได้ก่อน
		file, _ := ctx.FormFile("image")

		// Create Path สร้าง path สำหรับการจัดเก็บไฟล์
		path := "uploads/articles/" + strconv.Itoa(int(a.ID))
		os.MkdirAll(path, 0755)

		// Upload File
		filename := path + "/" + file.Filename
		if err := ctx.SaveUploadedFile(file, filename); err != nil {
			// ...
		}

		// Attach File to article
		a.Image = "http://127.0.0.1:8080/" + filename

		articles = append(articles, a)

		ctx.JSON(http.StatusCreated, gin.H{"article": a}) // retuen ออก client
	})

}

```

# การเข้าถึง Static Files บน Gin Framework
- เราจะไม่สามารถเข้าถึง URL `http://127.0.0.1:8080/uploads/articles/6/Avatar_Conan.jpg` ที่เราทำการ upload เข้ามาได้ผ่านหน้าเว็บเพราะ มันเป็น static file
- สามารถเข้าถึงได้โดยเรียกใช้ Static 	เวลาที่เราร้องขอมันจะไปมองหาไฟล์จากโฟลเดอร์ที่เรา upload

```go 
package main

import (
	"course-go/routes"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default() // สร้าง gin.Default เป็น server

	// http://127.0.0.1:8080/uploads/articles/6/Avatar_Conan.jpg
	r.Static("/uploads", "./uploads")

	uploadDirs := [...]string{"articles", "users"}
	for _, dir := range uploadDirs {
		os.MkdirAll("uploads/"+dir, 0755) // 0755 is permissions
	}

	routes.Serve(r)

	r.Run()
}

```

- ลองเอา URL ไปวางก็จะได้รูปภาพออกมา 

# Environment Variables
เรียนรู้การสร้างและใช้งาน Environment Variables ในโปรแกรมภาษา Go
- ในตอนที่ set url ของ image มีการระบุค่าของ Host `a.Image = "http://127.0.0.1:8080/" + filename` ลงไปตรงซึ่งไม่เหมาะเพราะเมื่อเรา deploy ออกไปอาจจะเปลี่ยนชื่อก็ได้ จึงควรแยกส่วนของโค้ดไปไว้ใน env(environment variable) โดยสร้างไฟล์ `.env`
- พอสร้างไฟล์ `.env` แล้วให้ import `github.com/joho/godotenv` ใน ไฟล์ main.go เพื่อที่จะสามารถอ่านไฟล์ `.env` ได้

```env
HOST=http://127.0.0.1:8080
```

```go
package main

import (
	"course-go/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default() // สร้าง gin.Default เป็น server

	// http://127.0.0.1:8080/uploads/articles/6/Avatar_Conan.jpg
	r.Static("/uploads", "./uploads")

	uploadDirs := [...]string{"articles", "users"}
	for _, dir := range uploadDirs {
		os.MkdirAll("uploads/"+dir, 0755) // 0755 is permissions
	}

	routes.Serve(r)

	r.Run() 
}

```

- แล้วไปแก้ไขไฟล์ routes.go `a.Image = os.Getenv("HOST") + "/" + filename`
- สามารถระบุ port ใหม่ได้ตรงๆ `r.Run() -> r.Run(":5000")` แต่ไม่ดี ให้ไปกำหนดที่ไฟล์ `.env` --> `PORT=5000` แล้วเรียกใช้ `r.Run(":" + os.Getenv("PORT")) `
- ในกรณีที่เราใช้ version control system เช่น git เราไม่ควรใส่ `.env` ลงไปเพราบางที่ .env อาจจะมีข้อมูลที่เป็นความลับอยู่ ถ้าไม่อยากให้เห็นต้องไประบุ `.env` ในไฟล์ `.gitignore` พร้อมทั้งสร้างไฟล์ `.env.example` ที่มีข้อมูลที่ต้องเซตเหมือน .env เพื่อให้คนที่จะพัฒนาเว็บเราต่อรู้ว่าต้องเซตอะไรบ้าง

# Model-View-Controller (MVC)
เรียนรู้การออกแบบโครงสร้าง API ตามหลักการของสถาปัตยกรรมแบบ MVC

- ไฟล์ routes.go มีโค้ดต่างๆเยอะแยะมากมายจึงต้องใช้สถาปัตยกรรมแบบ MVC

![MVC](/RestfulAPI_with_go/course-go/images/MVC1.png)

เราจะทำการแยกส่วนโค้ดของเราออกเป็น 3 ส่วน
1. Controller: เป็น logic ที่จัดการทั้ง Model และ View เป็นเหมือนตัวการ การทำงานที่ผสานการทำงานระหว่า Model และ View
2. View: เก็บ logic เกี่ยวกับการแสดงผล (UI Logic) 
3. Model: เก็บ logic เกี่ยวกับข้อมูล (DB, Business Logic)

![MVC](/RestfulAPI_with_go/course-go/images/MVC2.png)

เมื่อพูดถึงตัว `web framework` จะต้องมี `client` เข้ามาติดต่อมันจะอาศัย `URL` เช่น /article , /user เมื่อมี URL เข้ามาเกี่ยวข้องเลยต้องมีผู้จัดการเส้นทางก็คือ `Router` เมือ router พิจารนาาแล้วว่า URL นั้นเกี่ยวข้องกับสิ่งใดก็จะโยนให้ `Controller` ของสิ่งนั้นเป็นคนจัดการแล้ว `Controller` ก็จะพิจารณาเองว่ามันต้องการเข้าถึงข้อมูลอะไรใน `Model` พอได้ข้อมูลมา `Model` ก็จะส่งกลับไป `Controller` เพื่อส่งไปให้ `View` เพื่อแสดงผล

### ทำการแยกโค้ด
ทำการแยกโค้ดที่เขียนใน `routes.go` กระจายไปยัง package `/models` และ `/controller`

- สิ่งไหนที่เกี่ยวกับข้อมูล จะตัดส่วนนั้นไปอยู่ในส่วนของ `/models`
```go
// /models/article.go
package models

type Article struct {
	ID    uint   `json:"id"` // ส่งออกชื่อไปแสดงเป็นตัวเล็ก
	Title string `json:"title"`
	Body  string `json:"body"`
	Image string `json:"image"`
}

```
- ส่วนที่เกี่ยวกับการทำงานของ controllerv จะมีการยุ่งเกี่ยวเกี่ยวกับ Models และมีส่วนของการแสดงผล
```go
package routes

import (
	"course-go/controllers"

	"github.com/gin-gonic/gin"
)

func Serve(r *gin.Engine) {

	articlesGroup := r.Group("/api/v1/articles")
	articleController := controllers.Articles{}
	// บ่งบอกว่าเป็น controller
	{
		articlesGroup.GET("", articleController.FindAll)
		articlesGroup.GET("/:id", articleController.FindOne)
		articlesGroup.POST("", articleController.Create)
	}

}
```

```go
// /controller/article.go
package controllers

import (
	"course-go/models"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Articles struct{}

type createArticleForm struct {
	// map and validator
	Title string                `form:"title" binding:"required"` // binding: "required is ต้องใส่เข้ามาทุกครั้ง
	Body  string                `form:"body" binding:"required"`
	Image *multipart.FileHeader `form:"image" binding:"required"`
}

var articles []models.Article = []models.Article{
	{ID: 1, Title: "Title#1", Body: "Body#1"},
	{ID: 2, Title: "Title#2", Body: "Body#2"},
	{ID: 3, Title: "Title#3", Body: "Body#3"},
	{ID: 4, Title: "Title#4", Body: "Body#4"},
	{ID: 5, Title: "Title#5", Body: "Body#5"},
}

func (a *Articles) FindAll(ctx *gin.Context) {
	// ถ้าไม่มีการส่ง limit เข้ามาจะส่ง result กลับไป ก็คือส่ง articles ไปทั้งหมด
	result := articles                              //
	if limit := ctx.Query(("limit")); limit != "" { // return is string
		n, _ := strconv.Atoi(limit) // string to int

		result = result[:n] // มี limit จะเลือกเอาตั้งแต่ตัวแรกจนถึงตัวที่ limit
	}
	ctx.JSON(http.StatusOK, gin.H{"articles": result}) // มีการแสดงผล
}

func (a *Articles) FindOne(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id")) // string to int

	for _, item := range articles {
		if item.ID == uint(id) {
			ctx.JSON(http.StatusOK, gin.H{"article": item})
			return
		}
	}
	ctx.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
}

// จัดการ parameter
func (a *Articles) Create(ctx *gin.Context) {
	var form createArticleForm
	if err := ctx.ShouldBind(&form); err != nil { // ShouldBind validate ข้อมูลแบบ form-data
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	article := models.Article{
		ID:    uint(len(articles) + 1),
		Title: form.Title,
		Body:  form.Body,
	}

	// Get file หาไฟล์ดึงไฟล์ออกมาให้ได้ก่อน
	file, _ := ctx.FormFile("image")

	// Create Path สร้าง path สำหรับการจัดเก็บไฟล์
	path := "uploads/articles/" + strconv.Itoa(int(article.ID))
	os.MkdirAll(path, 0755)

	// Upload File
	filename := path + "/" + file.Filename
	if err := ctx.SaveUploadedFile(file, filename); err != nil {
		// ...
	}

	// Attach File to article
	article.Image = os.Getenv("HOST") + "/" + filename

	articles = append(articles, article)

	ctx.JSON(http.StatusCreated, gin.H{"article": article}) // retuen ออก client
}
```