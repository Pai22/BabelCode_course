# Install go 
ตั้งค่า `settings.json`
```json
{
  // ...existing code...
  "go.useLanguageServer": true,
  "[go]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    },
    "editor.tabSize": 2,           // ตั้ง tab size = 8
    "editor.insertSpaces": false   // ใช้ tab แทน space
  },
  "[go.mod]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "gopls": { 
    "usePlaceholders": true,
    "staticcheck": false
  }
}
```

## compile and run program
จะใช้คำสั่ง
```bash
# compile
$ go build main.go    
# เช็ค
$ ls                                                
main    main.go
# run
$ ./main                                            
Hello, World

 ```
หรือจะใช้อีกคำสั่ง จะเป็นการรวมทั้งสองเข้าด้วยกันเลยทั้ง compile & run
```bash
$ go run main.go
```

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World")
}

```

# ชนิดข้อมูลและการแปลง
ถ้าต้องการประกาศตัวแปรจะต้องใช้ `var` แล้วตามด้วยชื่อตัวแปรและชนิดข้อมูล ในการชประกาศ `var i int` 
- ใน go มีสิ่งที่เรียกว่า zero value อยู่คือ ค่าเริ่มต้นสำหรับตัวแปรใดๆ `ถ้าตัวแปรเป็น int ค่าเริ่มต้นจะเป็น 0` แต่`ถ้าตัวแปรเป็น bool ค่าเริ่มต้นเป็น false`
- สามารถประกาศตัวแปรพร้อมระบุ type ได้ด้วยบรรทัดเดียว เช่น `i := 20` go มันจะมองว่าเป็น int
- ประกาศตัวแปรไหนเป็น types ไหนแล้วตัวแปรนั้นจะไม่สามารถเปลี่ยน types ได้

```go
package main

import "fmt"

func main() {
// กำหนดค่า i เป็น float64
	i := 20.02
// แปลงค่า i เป็น int แล้วกำหนดให้เป็น j 
// j จึงเป็น int
	j := int(i)

	fmt.Println(j)
}

```

```bash
$ go run main.go
20
```
![Basic types](/RestfulAPI_with_go/images/BasicTypes.png)
# การใช้ const และ iota
### const
ตัวแปรที่สร้างขึ้นมาสามารถเปลี่ยนค่าได้ แต่ถ้าต้องการค่าคงที่จะใช้ `const` 
- `const` สามารถประกาศตัวแปรพร้อมกันหลยาตัวได้ 
```go
package main

import "fmt"

func main() {
	const (
		i = 1
		j
    // j จะมีค่าเท่ากับตัวแปรข้างบนคือ 1 
	)

	fmt.Println(i, j)
}
```

```bash
$ go run main.go
1 1  
```

### iota 
iota จะมีการกำหนดตัวเลขเริ่มต้นตั้งแต่ 0
```go
package main

import "fmt"

func main() {
	const (
		red = iota // ถ้า iota + 1 จะเริ่มต้นที่ 1
		green 
		blue
	)

	fmt.Println(red, green, blue) // 0 1 2
}

```
ถ้าไม่ต้องการ green แต่อยากให้ bule เป็น 2 ตัวที่ 2 จะต้องใส่้ `_`


# if-else statement
ตัวอย่างการใช้ if-else ใน go
```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	if os := runtime.GOOS; os == "darwin" { // {} จะต้องอยู่บรรทัดนี้ ถ้าตบลงไป error
		fmt.Println("You cool!")
	} else if os == "windows" {
		fmt.Println(("Switch to Linux Now!!"))
	} else {
		fmt.Print("O_o")
	}
}

```
สามารถประกาศตัวแปรค่าเริ่มต้นในบรรทัดที่เขียน `if` ได้เลยโดยคั่นด้วย `;` 

# for loop
while จะไม่มีการใช้ใน go แทนได้โดยใช้ for 
## for ปกติ
คล้ายๆกับภาษาอื่นๆ
```go
package main

import (
	"fmt"
)

func main() {
	for n := 1; n <= 10; n++ {
		fmt.Println(n)
	}
}

```

## for เทียบ while
```go
package main

import (
	"fmt"
)

func main() {
	n := 1
	for n <= 10 {
		fmt.Println(n)
		n++
	}
}
 
```
และสามารถทำ for แบบไม่รู้จบได้โดยไม่ใส้่เงือนไข
```go
for {
  fmt.Println("Hello")
}
```


# switch statement
- switch ใน go ไม่ต้องใส่ break
- สามารถรวม case ได้โดยประกาศคู่กัน เช่น `case "Sunday", "Saturday"`
- สามารถประกาศตัวแปรพร้อม switch ได้เลย
```go
package main

import (
	"fmt"
)

func main() {
	day := "Sunday"
  // หรือ switch day := "Sunday" ; day {}
	switch day {
	case "Sunday":
		fmt.Println(("Weekend"))
	case "Saturday":
		fmt.Println("Weekend")
	default:
		fmt.Println(("Workday"))
	}
}
```



# ฟังก์ชันในภาษา Go
- การสร้างฟังก์ชันใน go นั้นจะต้องมีการประกาศ types ของตัวแปรที่รับมาและส่งออก เช่น `func add(a int, b int) int {}` หรือรวมตัวแปร int ที่รับเข้ามาได้ `func add(a , b int) int {}` a, b ที่รับเข้ามาจะเป็น int และค่าที่ return ออกไปก็จะเป็น int
- func next สามารถคืนค่าออกไปได้ 2 ค่าและต้องกำหนดชนิดขช้อมูลที่คืนออกไปทั้งสองค่า `func next(num int) (int, int)` ในที่นี้รับชนิดข้อมูลที่เป็น int เข้ามา 1 ตัวและคืนค่าออกเป็น int ทั้งสองตัว

```go
package main

import "fmt"

func add(a int, b int) int {
	return a + b
}

func next(num int) (int, int) {
	return num + 1, num + 2
}

func main() {
	result := add(10, 20)
	x, y := next(10)

	fmt.Println(result) // 30
	fmt.Println(x, y)   // 11 12
}

```



# Pointers
ชนิดข้อมูลในการเก็บที่อยู่ของตัวแปร
- ตัวแปร pointer ของเราจะกำหนดชนิดข้อมูลให้มี `*` นำหน้า แล้วตามด้วยชนิดข้อมูลของสิ่งที่เราต้องการไปชี้ เช่น i := 20 ชนิดข้อมูลของ i คือ int แล้วต้องการชี้ไปที่ memory address ของ i ดังนั้นจะได้ `var p *int` หรือ `p := &i`
- & ดึงค่าของ memory address ออกมาเพื่อดูว่าที่อยู่มันอยู่ที่ไหน `p = &i`
- การใส่ `*` หน้าตัวแปรที่เป็น pointer จะเป็นการถามว่า ค่าที่มันชี้อยู่นั้นเป็นค่าอะไร เช่น `fmt.Println(*p)` จะได้ค่า `20` เพราะ p ชี้ไปที่ค่า 20 
```go
package main

import "fmt"

//ตัวแปรที่เก็บค่าของ 20 อยู่ในหน่วยความจำคือ 0x14000102020  

func main() {
  // var p *int
	i := 20
	p := &i

	fmt.Println(*p)
}

```


# การส่งค่าผ่านฟังก์ชันด้วย Pass by Value
- โดยปกติแล้วใน go เมื่อเรากำหนดตัวแปรไว้ใน main function แล้วเรียกใช้ function อื่นโดยการส่งตัวแปรใน main function ไป ตัวแปรของ function อื่นที่เราเข้ามานั้นจะเป็นตัวแปรใหม่ ก็คือ ตัวแปร maint function ก็จะยังคงเป็นค่าเดิม

- ถ้าต้องการให้ตัวแปรใน main function เปลี่ยนไปตามตัวแปร function อื่นต้องใช้ pointers เข้ามาช่วย

```go
package main

import "fmt"

func inc(num *int) {
	*num++ // ใส่ '*' เพื่อเข้าถึงค่า pointer
}

func main() {
	i := 20
	inc(&i)

	fmt.Println(i) // 21
}

```


