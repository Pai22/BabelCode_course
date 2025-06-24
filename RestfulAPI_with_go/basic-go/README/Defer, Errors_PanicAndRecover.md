# Defer

![Array](/RestfulAPI_with_go/basic-go/images/defer.png)

- เรียนรู้หลักการใช้งาน Defer เพื่อหน่วงให้การทำงานเกิดขึ้นหลังฟังก์ชันทำงานเสร็จ
- defer ทำงานหลัง function ทำงานเสร็จ
- ป้องกันการลือทำงานบางอย่าง
- defer ตัวสุดท้ายจะเริ่มทำงานก่อนจากนั้นไล่ขึ้นไป

# การสร้างและจัดการ Errors
เรียนรู้หลักการจัดการข้อผิดพลาด การสร้าง Error และการคืน Error จากฟังก์ชัน
```go
package main

import (
	"errors"
	"fmt"
)

func findIndex(s []int, num int) (int, error) {
	for i, n := range s {
		if n == num {
			return i, nil
		}
	}

	return 0, errors.New("Number nor found")
}

func main() {
	i, err := findIndex([]int{1, 2, 3}, 2)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(i)
	}
	//ถ้าส่งค่า 2 ไปซึ่งมีอยู่ใน array ก็จะคืนค่า index ที่มันอยู่ออกมาคือ 1
	//ถ้าส่งค่า 20 ไปซึ่งไม่มีอยู่ใน array ก็จะคืนค่า error ออกมาคือ Number nor found
}
```

# คุณสมบัติของ Panic และการใช้งาน
- เข้าใจการทำงานของ Panic และเมื่อไหร่ควรใช้ Errors เมื่อไหร่ควรใช้ Panic
- เมื่อเจอ panic มันจะปริ้นค่า panai ออกมาแล้วจบการทำงานพอดี

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println(1)
	fmt.Println(2)
	panic("Fail")
	fmt.Println(3)
	fmt.Println(4)
	fmt.Println(5)
}

```

```bash
$ go run main.go                                                      
1
2
panic: Fail

goroutine 1 [running]:
main.main()
        /Users/PAI/Documents/BabelCode_course/RestfulAPI_with_go/basic-go/main.go:10 +0x9c
exit status 2
```

### ควรใช้ error หรือ panic เมื่อไหร่ 
โดยปกติทั่วไปเราควรจะใช้ error เพราะข้อผิดพลาดต่างๆนั้นสามารถจัดการด้วย error ได้ ส่วน panic เมื่อเกิดข้อผิดพลาด program จะไม่สามารถทำงานต่อได้ เช่น กรณีเชื่อมฐานข้อมูลไม่ได้

# การดักจับ Panic ด้วย Recover
- เรียนรู้หลักการดักจับ Panic ด้วย Recover และ Defer
- กรณีที่เราสร้าง function แล้ว function นั้นไปเรียก function อื่นแล้วถ้า func อื่นของเรามี panic เกิดขึ้น panic นั้นจะถูกโยนเพื่อรอการจัดการในฟังก์ชันอื่นอีกทีนึง เรียกการจัดการนี้ว่า recover

