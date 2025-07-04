package config

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var db *gorm.DB // * is pointer

func InitDB() {
	var err error
	db, err = gorm.Open("postgres", os.Getenv("DATABASE_CONNECTION"))
	if err != nil {
		log.Fatal(err) // แสดงแค่ error ที่เกิดขึ้นเท่านั้น
	}

	db.LogMode(gin.Mode() == gin.DebugMode)
}

func GetDB() *gorm.DB {
	return db
}

func CloseDB() {
	db.Close()
}
