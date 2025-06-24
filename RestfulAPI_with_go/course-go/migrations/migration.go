package migrations

import (
	"course-go/config"
	"log"

	"gopkg.in/gormigrate.v1"
)

func Migrate() {
	db := config.GetDB()
	m := gormigrate.New(
		db,
		gormigrate.DefaultOptions,
		[]*gormigrate.Migration{
			m1750408721CreateArticlesTable(),
			m1750675753CreateCategoriesTable(),
			m1750679533AddCategoryIDToArticles(),
			m1750688576CreateUsersTable(),
			m1750693454AddUserIDToArticles(),
		},
	)

	if err := m.Migrate(); err != nil {
		log.Fatalf("Could not migrate: %v", err)
	}
	log.Println("Migration finished!")
}
