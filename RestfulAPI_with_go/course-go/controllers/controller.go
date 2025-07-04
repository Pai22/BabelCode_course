package controllers

import (
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

type pagingResult struct {
	Page      int `json:"page"`
	Limit     int `json:"limit"`
	PrevPage  int `json:"prevPage"`
	NextPage  int `json:"nextPage"`
	Count     int `json:"count"`
	TotalPage int `json:"totlaPage"`
}

type pagination struct {
	ctx     *gin.Context
	query   *gorm.DB
	records interface{}
}

func (p *pagination) paginate() *pagingResult {
	// 1. Get limiit, page ?limit=10&page=2 ดึงค่า limit และ query
	page, _ := strconv.Atoi(p.ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(p.ctx.DefaultQuery("limit", "12"))
	// 2. count records ตรวจสอบฐานข้อมูลว่ามี  recordas กี่ตัว
	ch := make(chan int)
	go p.countRecords(ch)

	// 3. Find Records records หรือข้อมูลที่เราสนใจที่ตรงกับ page และ limit คือค่าอะไรบ้าง
	offset := (page - 1) * limit
	p.query.Limit(limit).Offset(offset).Find(p.records)

	// 4. total page หาจำนวน page ทั้งหมด
	count := <-ch
	totalPage := int(math.Ceil(float64(count) / float64(limit)))

	// 5. Find nextPage
	var nextPage int
	if page == totalPage {
		nextPage = totalPage
	} else {
		nextPage = page - 1
	}

	// 6. create pagingResult
	return &pagingResult{
		Page:      page,
		Limit:     limit,
		Count:     count,
		PrevPage:  page - 1,
		NextPage:  nextPage,
		TotalPage: totalPage,
	}

}

func (p *pagination) countRecords(ch chan int) {
	var count int
	p.query.Model(p.records).Count(&count)

	ch <- count
}
