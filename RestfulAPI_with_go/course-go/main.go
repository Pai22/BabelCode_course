package main

import (
	"course-go/config"
	"course-go/migrations"
	"course-go/routes"

	// "course-go/seed"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("APP_ENV") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	config.InitDB()
	defer config.CloseDB()
	migrations.Migrate()
	// seed.Load()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AddAllowHeaders("Authorization")

	r := gin.Default()          // สร้าง gin.Default เป็น server
	r.Use(cors.New(corsConfig)) // ใช้ cors middleware
	// http://127.0.0.1:8080/uploads/articles/6/Avatar_Conan.jpg
	r.Static("/uploads", "./uploads")

	uploadDirs := [...]string{"articles", "users"}
	for _, dir := range uploadDirs {
		os.MkdirAll("uploads/"+dir, 0755) // 0755 is permissions
	}

	routes.Serve(r)

	r.Run(":" + os.Getenv("PORT"))
}
