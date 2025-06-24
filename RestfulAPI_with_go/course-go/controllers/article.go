package controllers

import (
	"course-go/models"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"github.com/jinzhu/gorm"
)

type Articles struct {
	DB *gorm.DB
}

type createArticleForm struct {
	// map and validator
	Title      string                `form:"title" binding:"required"` // binding: "required is ต้องใส่เข้ามาทุกครั้ง
	Excerpt    string                `form:"excerpt" binding:"required"`
	Body       string                `form:"body" binding:"required"`
	CategoryID uint                  `form:"categoryId" binding:"required"`
	Image      *multipart.FileHeader `form:"image" binding:"required"`
}

type updateArticleForm struct {
	// map and validator
	Title      string                `form:"title"` // binding: "required is ต้องใส่เข้ามาทุกครั้ง
	Excerpt    string                `form:"excerpt"`
	Body       string                `form:"body"`
	CategoryID uint                  `form:"categoryId"`
	Image      *multipart.FileHeader `form:"image"`
}

type articleResponse struct {
	ID         uint   `json:"id"`
	Title      string `json:"title"`
	Excerpt    string `json:"excerpt"`
	Body       string `json:"body"`
	Image      string `json:"image"`
	CategoryID uint   `json:"categoryId"`
	Category   struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	} `json:"category"`
	User struct {
		Name   string `json:"name"`
		Avatar string `json:"avatar"`
	} `json:"user"`
}

type createdOrUpdatedResponse struct {
	ID         uint   `json:"id"`
	Title      string `json:"title"`
	Excerpt    string `json:"excerpt"`
	Body       string `json:"body"`
	Image      string `json:"image"`
	CategoryID uint   `json:"categoryId"`
	UserID     uint   `json:"userId"`
}
type articlesPaging struct {
	Items  []articleResponse `json:"items"`
	Paging *pagingResult     `json:"paging"`
}

func (a *Articles) FindAll(ctx *gin.Context) {
	articles := []models.Article{} // empty slice เพื่อเก็บข้อมูลที่ดึงออกมา

	query := a.DB.Preload("User").Preload("Category").Order("id desc")

	categoryId := ctx.Query("categoryId")
	if categoryId != "" {
		query = query.Where("category_id = ?", categoryId) // ถ้าใส่ categoryId เข้ามาให้ filter ตาม categoryId
	}

	term := ctx.Query("term")
	if term != "" {
		query = query.Where("title ILIKE ?", "%"+term+"%") // ILIKE ใช้สำหรับค้นหาแบบไม่สนใจตัวพิมพ์เล็ก-ใหญ่)
	}

	pagination := pagination{ctx: ctx, query: query, records: &articles} // ดึงข้อมูลทั้งหมดออกมาก
	paging := pagination.paginate()                                      // a.DB.Order("id desc") เรียงจากล่าสุดก่อน

	serializedArticles := []articleResponse{} // empty slice => []
	copier.Copy(&serializedArticles, &articles)
	ctx.JSON(http.StatusOK, gin.H{"articles": articlesPaging{Items: serializedArticles, Paging: paging}})
}

func (a *Articles) FindOne(ctx *gin.Context) {
	article, err := a.findArticleByID(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	serializedArticle := articleResponse{}
	copier.Copy(&serializedArticle, &article)
	ctx.JSON(http.StatusOK, gin.H{"article": serializedArticle})
}

// จัดการ parameter
func (a *Articles) Create(ctx *gin.Context) {
	var form createArticleForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	// form => article เอาข้อมูลจาก form ไปสร้างตัว articles
	var article models.Article
	user, _ := ctx.Get("sub")
	copier.Copy(&article, &form)
	article.User = *user.(*models.User)
	// articles => db เซ็ตค่าลงไปในฐานข้อมูลของเรา
	if err := a.DB.Create(&article).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	a.setArticleImage(ctx, &article)
	serializedArticle := createdOrUpdatedResponse{}
	copier.Copy(&serializedArticle, &article)

	ctx.JSON(http.StatusCreated, gin.H{"article": serializedArticle})
}

func (a *Articles) Update(ctx *gin.Context) {
	var form updateArticleForm
	if err := ctx.ShouldBind(&form); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	article, err := a.findArticleByID(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := a.DB.Model(&article).Update(&form).Error; err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error})
		return
	}

	a.setArticleImage(ctx, article)

	var serializedArticle createdOrUpdatedResponse
	copier.Copy(&serializedArticle, article)
	ctx.JSON(http.StatusOK, gin.H{"article": serializedArticle})
}

func (a *Articles) Delete(ctx *gin.Context) {
	article, err := a.findArticleByID(ctx)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	a.DB.Unscoped().Delete(&article)
	ctx.Status(http.StatusNoContent)
}

func (a *Articles) setArticleImage(ctx *gin.Context, article *models.Article) error {
	file, err := ctx.FormFile("image")
	if err != nil || file == nil {
		return err
	}

	// เปลี่ยน image รูปภาพเก่าจะต้องถูกลบ
	if article.Image != "" {
		// http://127.0.0.1:5001/upload/articles/<ID>/image.png
		// 1. /upload/articles/<ID>/image.png เอา localhost ออก
		article.Image = strings.Replace(article.Image, os.Getenv("HOST"), "", 1)
		// 2. <WD>/upload/articles/<ID>/image.png
		pwd, _ := os.Getwd()
		// 3. Remove <WD>/upload/articles/<ID>/image.png
		os.Remove(pwd + article.Image)
	}

	path := "uploads/articles/" + strconv.Itoa(int(article.ID))
	os.MkdirAll(path, 0755)
	filename := path + "/" + file.Filename
	if err := ctx.SaveUploadedFile(file, filename); err != nil {
		return err
	}

	article.Image = os.Getenv("HOST") + "/" + filename
	a.DB.Save(article)

	return nil
}

func (a *Articles) findArticleByID(ctx *gin.Context) (*models.Article, error) {
	var article models.Article
	id := ctx.Param("id")

	if err := a.DB.Preload("User").Preload("Category").First(&article, id).Error; err != nil {
		return nil, err
	}

	return &article, nil
}
