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
- แทนนิยามพฤติกรรม
```go
package main

import "fmt"

type generator interface {
	generate()
}

type pdf struct {
	content string
}

func (p pdf) generate() {
	fmt.Println("generating...")
}

func main() {
	var gen generator // gen is interface
	gen = pdf{content: "My PDF"}

	gen.generate()
}

```

# Method Sets
เข้าใจหลักการทำงานของ Method Sets กับ Interface และการนิยาม Methods บน struct เพื่อให้ใช้งานกับ Interface ได้อย่างถูกต้อง

![MethodSets](/RestfulAPI_with_go/basic-go/images/MethodSets.png)
ตารางการสร้าง method ที่สามารถใช้งานกับ interface ได้

# Polymorphism
การใช้ interface สามารถทำให้เกิดคุณสมบัติที่เรียกว่า `Polymorphism` คือความสามารถที่ออบเจ็กต์หนึ่งสามารถเป็นได้หลายรูปร่าง บทเรียนนี้จะกล่าวถึงการสร้างการทำงานแบบ Polymorphism บนพื้นฐานของ Interface

![polymorphism](/RestfulAPI_with_go/basic-go/images/polymorphism.png)

- การใช้งาน polymorphism จะต้องมีการกำหนด interface ขึ้มาก่อน

# Type Assertions
เรียนรู้กลไกการเข้าถึงค่าข้อมูลที่ Interface จัดเก็บอยู่ผ่าน Type Assertions

```go
package main

import (
	"fmt"
	"math"
)

type shape interface {
	area() float64
}

type circle struct {
	radius float64
}

type rectangle struct {
	width  float64
	height float64
}

func (c circle) area() float64 {
	return math.Pi * math.Pow(c.radius, 2)
}

func (r rectangle) area() float64 {
	return 2 * (r.width + r.height)
}

func main() {
	var s shape
	s = circle{radius: 10} // circle ถือว่าเป็น shape เลยสามาใช้ตัวแปร s ได้
	//แต่ไม่สามารถเรียก s.radius ได้ แต่สามารถใช้ type assertions ได้

	// type assertions
	c, ok := s.(circle) // มีค่า ok ด้วย

	fmt.Println(c.radius, ok) // 10 true
  // ถ้า type ตรงได้ค่าออกมาเป็น true 
}

```

# Type Switch
- สามารถใช้ Switch case ในการพิจารณาได้ว่า interface ทำการผูกความสัมพันธ์กับ struct tyes อะไร
```go
package main

import (
	"fmt"
	"math"
)

type shape interface {
	area() float64
}

type circle struct {
	radius float64
}

type rectangle struct {
	width  float64
	height float64
}

func (c circle) area() float64 {
	return math.Pi * math.Pow(c.radius, 2)
}

func (r rectangle) area() float64 {
	return 2 * (r.width + r.height)
}

func main() {
	var s shape
	s = circle{radius: 10}

	switch s.(type) {
	case circle:
		fmt.Println("circle")
	case rectangle:
		fmt.Println("rectangle")
	default:
		fmt.Println("General Shape")
	}
	// circle

}
 
```

# Empty Interface
กรณีที่ต้องการสร้างตัวแปรที่เข้ากับชนิดข้อมูลใด ๆ ก็ได้ Empty Interface คือคำตอบสำหรับสิ่งนี้ บทเรียนนี้จะพูดถึงการสร้างและการใช้งาน Empty Interface
- การเขียน Empty Interface เขียน `interface{}` โดยไม่ใส่ method อะไรเลย จึงสามารถเอาไปเข้าคู่กับค่าไรก็ได้
- ใช้กับตัวแปรที่อยากเก็บค่าอะไรก็ได้

```go
package main

import (
	"fmt"
)

func main() {
	result := []interface{}{"A", 10, false}
	fmt.Println(result...) // A 10 false
}

```

# Packages และ Go Modules
- เรียนรู้การใช้งาน Packages หลักการประกาศข้อมูลเพื่อให้เข้าถึงได้จาก Packages อื่น รวมถึงการสร้างและใช้งาน Go Modules

```go
package main

import (
	"fmt"
	"math"
)

type shape interface {
	area() float64
}

type circle struct {
	radius float64
}

type rectangle struct {
	width  float64
	height float64
}

func (c circle) area() float64 {
	return math.Pi * math.Pow(c.radius, 2)
}

func (r rectangle) area() float64 {
	return 2 * (r.width + r.height)
}

func main() {
}
 
```

- ทำการแยก package ออกจากไฟล์ main.go โดยสร้างโฟเดอร์ `/shape` แล้วมี `/circle.go` , `/rectangle.go` และ `/shape.go`  อยู่ภายใต้โฟลเดอร์ `/shape` ซึ่งทั้งสามตัวจะมี package ชื่อว่า shape อยู่ในไฟล์
- เมื่อสร้างเสร็จให้ออกคำสั่ง `go mod init basic-go` (basic-go is module name ) 
- พอออกคำสั่งแล้วจะมีไฟล์ `go.mod` ขึ้นมา บ่งบอกว่าโปรเจคของเรามันถือว่าเป็น module อะไร

- ชื่อของอะไรก็ตามที่ขึ้นต้นด้สยตัวเล็ก จะถูกมองเห็นแค่ภายใน package ของมันทั้งชื่อ method และชื่อ field

### ตัวอย่างการเรียกใช้ package 
```go
package main

import (
	"basic-go/shape"
	"fmt"
)

func main() {
	c := shape.Circle{Radius: 10}

	fmt.Println(c) // {10}
}

```

- ถ้าเกิด package ไหนที่เราใช้งานอยู่แล้วมาจาก internet ถ้ามันยังไม่เคยมี package นั้นบนเครื่องของเรา มันจะทำการโหลดมาเมื่อรันคำสั่ง `go run main.go` จะได้ไฟล์ `go.sum` 
```bash 
$ go mod tidy # ลบ package ที่ไม่ใช้แล้ว
```