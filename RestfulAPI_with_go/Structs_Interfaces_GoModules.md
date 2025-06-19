# การสร้างและใช้งาน Struct
การสร้างชนิดข้อมูลใหม่ผ่านตัว struct เปรียบเสมือนแม่พิมพ์มันนิยามให้เป็นโครงสร้างเฉยๆ

```go
package main

import (
	"fmt"
)

type user struct {
	name string
	age  uint
}

type article struct {
	title   string
	excerpt string
	body    string
	author  user
}

func main() {
	u := user{name: "Somchai", age: 21}
	u.age = 22
	fmt.Println(u) // {Somchai 22}

	a := article{
		title:   "Title",
		excerpt: "Excerpt",
		body:    "Body",
		author:  user{name: "Somchai", age: 21},
	}

	fmt.Println(a) // {Title Excerpt Body {Somchai 22}}

}

```

# Type Embedding
กำหนด type article author สามารรถใช้ user ได้โดยตรงเลย และ a สามารถเรียก age ได้โดยตรงไม่ต้องผ่าน user เพราะมนถือว่า user นี้เป็นของ article
```go
package main

import (
	"fmt"
)

type user struct {
	name string
	age  uint
}

type article struct {
	title   string
	excerpt string
	body    string
	user
}

func main() {
	a := article{
		title:   "Title",
		excerpt: "Excerpt",
		body:    "Body",
		user:    user{name: "Somchai", age: 21},
	}

	fmt.Println(a.age) // 21

}

```

# การนิยาม Methods และ Method Receiver
เรียนรู้การนิยาม Methods และการผูกความสัมพันธ์กับ struct ผ่าน Method Receiver ทั้งชนิด Value Receiver และ Pointer Receiver

- สร้างชนิดข้อมูลใหม่คือ enrollment โดยเป็น struct ถ้าเกิดเราทำการสร้าง method แล้วสามารถเรียก method นั้นผ่านตัวแปรได้โดยตรง (method is functions) 
- method ต่างจาก function คือ method จะต้องมีการผูกความสัมพัธ์กับ struct ตัวหนึ่ง 

### method value receivers and method pointer receivers
```go
package main

import "fmt"

type enrollment struct {
	semaster string
	courses  []string
}

// method value receivers
func (en enrollment) courseAt(index uint) string {
	return en.courses[index]
}

// method pointer receivers
func (en *enrollment) addCourse(course string) {
	en.courses = append(en.courses, course)
}

func main() {
	e := enrollment{semaster: "1/63", courses: []string{"Java", "C#"}}

	result := e.courseAt(0) // สำเนาค่า e ส่งไปที่ method
	fmt.Println(result)     // Java

	(&e).addCourse("Go") // จะส่ง memory address ของ e เข้าไป จริงๆไม่จำเป็นต้าใส่ '&' ก็ได้
	fmt.Println(e.courses) // [Java C# Go]
}

```

# Interface
interface เป็นสิ่งที่ใช้ระบุว่า สิ่งที่เราสนใจในพฤติกรรมนั้นคืออะไร และถ้าเกิดมี struct ตัวไหน หรือมี method ตรงกับสิ่งที่ interface ระบุเราจะถือว่า เป็น interface ตัวที่เราระบุเช่เดียวกัน
