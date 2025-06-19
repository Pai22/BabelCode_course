# array
array คือข้อมูลที่มีหลายๆตัวและมีชนิดข้อมูลเดียวกันถูกรวมกลุ่มเข้าด้วยกัน

![Array](/RestfulAPI_with_go/images/Array.png)

ใส่ตัวแปรที่สามารถระบุเป็นตัวเลขได้

![Array](/RestfulAPI_with_go/images/ArrayIndex.png)

# การใช้งาน slice
การใช้ arr ที่ไม่ได้ประกาศตัวเลขนั้นเรียกว่า slice 

```go
package main

import "fmt"

func main() {
  arr := [5]string{"A", "B", "C", "D", "E"} // array

	result := arr[0:3] // slice

	fmt.Println(result) // [A, B, C]
}

```

![Slice](/RestfulAPI_with_go/images/Slice.png)

arr และ slice จะมีการแชร์ข้อมูลการอยู่ 
- ถ้า slice มีการเปลี่ยนค่าใน index ใน arr ก็จะถูกเปลี่ยนไปด้วย

```go
package main

import "fmt"

func main() {
	arr := [5]string{"A", "B", "C", "D", "E"}

	result := arr[2:4]

	result[0] = "M"

	fmt.Println(result, arr) // [M D] [A B M D E]
}

```

- สร้าง slice โดยไม่ต้องสร้าง arr ขึ้นมาก่อนก็สามารถทำได้ โดยใช้ syntax เหมือนกับ arr แต่ไม่ต้องระบุตัวเลข เช่น `s := []string{"A", "B", "C", "D", "E"}` 
- ถ้าต้องการเพิ่มข้อมูลใน arr ต้องใข้ **append** เช่น `s2 := append(s,"F")`

![SliceNoArr](/RestfulAPI_with_go/images/SliceNoArr.png)

# การดำเนินการบน slice

```go
package main

import "fmt"


func main() {
	words := []string{"Hello", "Hi", "Bye", "Thailand", "Japan"}

	// Find
	fmt.Println(words[2]) //Bye

	// Append
	words = append(words, "Go")
	fmt.Println(words) // [Hello Hi Bye Thailand Japan Go]

	// Remove
	// index => 2 (Bye)
	// {"Hello", "Hi"} + {"Thailand", "Japan}
	words = append(words[:2], words[3:]...)
	fmt.Println(words) // [Hello Hi Thailand Japan]

}

```

# การใช้งานฟังก์ชัน make
ถ้าต้องการสร้าง slice ที่สามารถกำหนด len และ cap ได้ตามใจ ใช้ฟังก์ชัน make

- กรณี 1 s2 ถูกสร้างมาให้มีความจุ 5 แล้ว append เพิ่มไป 2 ตัวจะเหลือ 3 แล้วสร้าง s3 โดยชี้ไปที่ arr เดียวกันแล้วเพิ่ม 6 ที่ยังคงเป็น arr เดียวกันเพราะความจุของ s2 ยังไม่เต็ม ตัวอย่างตอนเพิ่ม [1 2] [1 2 6] -> เปลี่ยนค่า [10 2] [10 2 6] 
```go
package main

import "fmt"

func main() {
	s2 := make([]int, 0, 5)
	s2 = append(s2, 1, 2)
	s3 := append(s2, 6)

	s3[0] = 10

	fmt.Println(s2, s3)
}

```

- กรณี 1 s2 ถูกสร้างมาให้มีความจุ 5 แล้ว append เพิ่มไป 5 ตัวจะเหลือ 0 แล้วสร้าง s3 โดยชี้ไปที่ arr เดียวกันแล้วเพิ่ม 6 แต่ s3 แต่ s3 จะสร้าง arr ขึ้นมาใหม่เพราะ arr ของ s2 เต็มแล้ว ตัวอย่างตอนเพิ่ม [1 2 3 4 5] [1 2 3 4 5 6] -> เปลี่ยนค่า [1 2 3 4 5] [10 2 3 4 5 6]
```go
package main

import "fmt"

func main() {
	s2 := make([]int, 0, 5)
	s2 = append(s2, 1, 2, 3, 4, 5)
	s3 := append(s2, 6)

	s3[0] = 10

	fmt.Println(s2, s3)
}
```

# Empty Slice VS Nil Slice
- มีสิ่งที่เหมือนกันก็คือ เป็น sline ที่มี len และ cap เป็น 0 
- แต่ empty slice เบื่องหลักการทำงานจะมีการสร้าง arr ที่มีความยาวเป็น 0 ขึ้นมาทำให้ในส่วนของ add ptr มีค่า
![Empty slice vs NIL slice](/RestfulAPI_with_go/images/EMSVSNILS.png)

# การใช้งาน map
- เข้าถึงข้อมูลด้วยการใช้ key โดยเป็น string เช่น `credits := map[string]int{}` index จะเป็น string และ value เป็น int 
```go
package main

import "fmt"

func main() {
	credits := map[string]int{
		"Java":   3,
		"C++":    3,
		"Python": 4,
	}

	result := credits["Java"]
	fmt.Println(result) // 3

	delete(credits, "C++")

	result2, ok := credits["C++"]
	fmt.Println(result2, ok) // 0 false
}

```

- สามารถใส่ make เข้าไปได้
```go
package main

import "fmt"

func main() {
	credits := make(map[string]int)
	credits["Java"] = 3
	credits["C++"] = 3
	credits["Python"] = 4

	result := credits["Java"]
	fmt.Println(result) // 3

	delete(credits, "C++")

	result2, ok := credits["C++"]
	fmt.Println(result2, ok) // 0 false
}

```

# วนลูปด้วย for-range
วนลูปรอบ arr, slice และ map

  - for-rage จะต้องมีตัวแปร 2 ตัว ณ ที่นี้ k คือ key v คือ value แต่สามารถไม่ใส่ตัวแรกได้แค่กำหนดเป็น `_`

```go
package main

import "fmt"

func main() {
	courese := []string{"Java", "C++", "Python"}

	for _, v := range courese {
		fmt.Println(v)
		// Java
		// C++
		// Python
	}
}

```

```go
package main

import "fmt"

func main() {
	credits := map[string]int{
		"Java":   3,
		"C++":    3,
		"Python": 4,
	}

	for k, v := range credits {
		fmt.Println(k, v)
		// Python 4
		// Java 3
		// C++ 3
	}
}

```

# string และ []byte 