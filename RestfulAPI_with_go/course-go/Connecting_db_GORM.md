# การเชื่อมต่อฐานข้อมูลผ่าน GORM
เรียนรู้การเชื่อมต่อฐานข้อมูลประเภท RDBMS เช่น PostgreSQL ด้วย GORM

- create folder and file /config/db.go
- สร้างฟังก์ชันการทำงานเกี่ยวกับฐานข้อมูลใน db.go `InitDB()`
- สร้างฟังก์ชันสำหรับปิดฐานข้อมูลใน db.go `CloseDB()`

สามารถทำการเชื่อมต่อกับฐานข้อมูลได้โดยการ import ดูตัวอย่างได้จาก[ที่นี่](https://gorm.io/docs/connecting_to_the_database.html)

- ทำการ import 
```go
import(
"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)
```

File: db.go

```go
package config

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB // * is pointer

func InitDB() {
	var err error
	db, err = gorm.Open("sqlite3", "./gorm.db")
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

```

### Postgress 
ทำการติดตั้งฐานข้อมูล Postgress ได้จาก [Postgressapp](https://postgresapp.com/) และติดตั้งตัวเชื่อมต่อกับ Postgress ได้จาก [Postico](https://eggerapps.at/postico2/)

# Database Migrations
เรียนรู้การสร้าง Models และหลักการของ Database Migrations และการเปลี่ยน Schema ของฐานข้อมูล

- สร้าง models ใน gorm เพื่อเป็นตัวแทนของข้อมูลแล้วทำให้เกิด table in database

```go
package models

import "github.com/jinzhu/gorm"

type Article struct {
	gorm.Model
	Title   string `gorm:"unique;not null"`
	Excerpt string `gorm:"not null"`
	Body    string `gorm:"not null"`
	Image   string `gorm:"not null"`
}
```

![MigrationPSG](/RestfulAPI_with_go/course-go/images/MigrationPSG.png)

ในกระบวนการพัฒนา software ฐานข้อมูลของเราจะมี schema หรือโครงสร้างข้อมูลของเราเปลี่ยนแปลงตลอดเวลา จึงต้องใช้ `Migration` ว่าโครงสร้างของฐานข้อมูลจะต้องเปลี่ยนแปลงไปในทิศทางไหนและมีโครงสร้างไหนที่ถูกเปลี่ยนแปลงไปแล้วบ้าง

![MigrationPSG](/RestfulAPI_with_go/course-go/images/Migration1.png)

- migration มี script ที่ชื่อว่า `up` และ `down`
- การสร้าง migration จะใช้ไลบราลี่ที่ชื่อว่า [gormigrate](https://github.com/go-gormigrate/gormigrate)

```bash #หาค่า tamestamp เพื่อสร้างไฟล์ migrations
date +%s                                                 
1750408299
```

# การสร้างข้อมูลใหม่ในฐานข้อมูล
เรียนรู้หลักการสร้างข้อมูลใหม่ผ่าน GORM การตรวจสอบข้อผิดพลาดในการสร้าง และการคัดลอกข้อมูลข้าม struct

# การ Query ข้อมูลด้วยเทคนิคต่าง ๆ
เรียนรู้การเข้าถึงข้อมูลในฐานข้อมูลทั้งแบบผลลัพธ์เดี่ยวและหลายข้อมูล สามารถดูตัวอย่างได้จาก[ที่นี่](https://gorm.io/docs/query.html)

# การสร้างการทำงานของ Pagination
เรียนรู้การสร้างฟอร์มและส่งข้อมูลฟอร์มแบบ JSON ผ่านไคลเอนต์ รวมถึงการอ่านข้อมูลจากฟอร์มและการตรวจสอบข้อผิดพลาดในฟอร์ม
(HTTP: GET)

# การปรับปรุงประสิทธิภาพของ Pagination
เรียนรู้การใช้ Goroutines เพื่อปรับปรุงประสิทธิภาพการทำงานของ Pagination
(HTTP: GET)

# การอัพเดทข้อมูลจากฟอร์ม
เรียนรู้การรับค่าข้อมูลจากฟอร์มเพื่อนำไปอัพเดทข้อมูลในฐานข้อมูล
(HTTP: PATCH) ส่งเป็น body: form-data

# การลบข้อมูล
เรียนรู้การลบข้อมูลที่มีอยู่
(HTTP: DELETE)

# ทบทวนการใช้งาน CRUD ผ่าน GORM
ทบทวนการใช้งาน CRUD ผ่านการอ่าน สร้าง แก้ไข ลบ Categories
JSON: body: row

# Associations
เรียนรู้สร้างความสัมพันธ์ระหว่าง Models แบบ Belongs To และแบบ Has Many รวมถึงหลักการของการทำ Preloading

# Database Seeding
เรียนรู้การเตรียมข้อมูลสำหรับการทดสอบบนการทำงานของ Development
สร้าง seed ด้วย faker