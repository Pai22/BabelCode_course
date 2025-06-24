# Concurrentcy VS Palallelism
เข้าใจข้อแตกต่างของการทำงานแบบ Concurrency และ Parallelism

### Concurrentcy
CPU มี 1 Core จากเดิมที่เป็นงานชิ้นใหญ่ทั้งโปรแกรมเราควรที่จะหันซอยย่อยออกเป็นชิ้นงานเล็กๆและแต่ละชิ้นงานจะต้องมีอิสระออกจากกัน หมายความว่าเราจะหยิบชิ้นงานไหนมารันก่อนหลังก็ควรจะได้ผลลัพธ์เหมือนกัน

### Palallelism
CPU มีหลาย Core สามารถเอางานไปรันหลายๆ core ได้แบบพร้อมๆกัน ก่อนจะเกิด palallelism ได้ต้องเกิดการแบ่งงานแบบ concurrentcy ก่อน

# Goroutines
- เรียนรู้การสร้างการทำงานแบบ Concurrency ด้วย Goroutines และการใช้งาน sync.WaitGroup(รอการทำงานห)

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

var wg sync.WaitGroup

func printAndSleep(num int) {
	defer wg.Done() // เมื่อทำงานเสร็จให้เรียกมันเพื่อดูว่าเสร็จไปแล้วกี่งาน

	time.Sleep(1 * time.Second)
	fmt.Println(num)
}

func main() {
	wg.Add(10) // มีการรอการทำงานอยู่ 10 ตัว

	for i := 1; i <= 10; i++ {
		go printAndSleep(i)
	}

	wg.Wait() // รอทำงานก่อนเพราะถ้าไม่ใส่มันจะจบการทำงาน main เลย

	// result ท่ได้จะได้เลข 1-0 แบบไม่เรียง (เป็นการทำงานแบบขนาน)
}

```

# Channels
- channels ถูกใช้เมื่ิอไม่สามารถเอาผลลัพธ์จาก goroutines มาใช้งานได้
- เข้าใจหลักการสื่อสารของ Goroutines ผ่าน Channels และการใช้งาน Channels ในสถานการณ์ต่าง ๆ
- Channels เป็นท่อที่มีข้อมูลไหลอยู่

```go
package main

import "fmt"

func sum(ch chan int, nums []int) {
	result := 0

	for _, v := range nums {
		result += v
	}

	ch <- result // เอาส่งในท่อ 3 ครั้ง
}

func main() {
	result := 0
	ch := make(chan int)
	nums := []int{
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
		10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
		100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
	}

	go sum(ch, nums[0:10])
	go sum(ch, nums[10:20])
	go sum(ch, nums[20:])

	for i := 1; i < 4; i++ {
		result += <-ch
	}

	fmt.Println(result)
}
```