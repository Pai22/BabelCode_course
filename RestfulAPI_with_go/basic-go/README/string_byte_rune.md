# string และ []byte
### byte slice
- string ในภาษา go จะถือว่าเป็น slice ของ []byte (byte => uint8 (0 - 255))
- str เป็นค่าของ byte ที่สามารถอ่านค่าได้อย่างเดียวไม่สามารถเปลี่ยนค่าได้

```go
package main

import (
	"fmt"
)

func main() {
	str := "Hello World"
	firstLetter := str[0]

	fmt.Println(firstLetter)         // ได้ 72 เป็นรหัส ASCII => H
	fmt.Println(string(firstLetter)) // H
	fmt.Println(len(str))            // 11

	for i := 0; i < len(str); i++ {
		fmt.Print(string(str[i])) // Hello World
	}

}

```

# การใช้งาน Rune
การเข้าถึงตัวอักษรแต่ละตัว เราไม่สามารถ acsess index ของ string ได้โดยตรงถ้าไม่ใช่ตัวอักษรภาษาอังกฤษ จึงต้องใช้ `rune` ในการเข้าถึงตัวอักษรแต่ละตัว 

rune เป็นตัวแทน Unicode Code Points ซึ่งเป็นค่าท่ใช้แทนตัวอักษรทั่วโลกได้เพราะฉะน้นค่าของ rune จึงต้องมีขนาดใหญ่

```go
package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	// rune => int32
	str := "สวัสดีชาวโลก"

	word := []rune(str)

	fmt.Println(word[0])                     // 3626
	fmt.Println(string(word[0]))             // ส
	fmt.Println(utf8.RuneCountInString(str)) // 12
  fmt.Println(len(word)) // 12
}
```
- การใช้นับตัวอักษรไม่สามารถใช้ len ได้ เพราะค่ามันไม่ตรง ต้องใช้ฟังก์ชันในการแปลงคือ `RuneCountInString` หรือ ทำ str ให้เป็น rune ก่อน

# ฟังก์ชันของ strings

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	// result := strings.Contains("BabelCoder", "bel") // ดูว่ามี bel อยู่ในประโยคไหม
	// result := strings.Count("สวัสดี โชคดีนะ", "ดี") // ดูว่ามี ดี อยู่ในประโยคเท่าไหร่
	// result := strings.HasPrefix("Hello World", "Hell") // เช็คว่า Hell ขึ้นต้นประโยคไหม
	// result := strings.HasSuffix("Hello World", "ld") // เช็คว่า ld ลงท้ายประโยคไหม
	// result := strings.Join([]string{"สวัสดี", "ชาวโลก"}, "-") // เอาสมาชิกแต่ละตัวมารวมกันโดยกั้นด้วยเครื่องหมาย "-"
	result := strings.ToUpper("hello") // แปลงตัวอักษรแต่ละตัวให้เป็นตัวใหญ่
	// result := strings.ToLower("Hello") // แปลงตัวอักษรแต่ละตัวให้เป็นตัวเล็ก

	fmt.Println(result)
}

```

# Number Parsing
มารู้จัก function บางส่วนที่อยู่ใน `strconv` จะประกอบไปด้วย function ในการ conv ค่าไปค่ากลับของตัว string
```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	a, _ := strconv.ParseFloat("3.14", 64) // 64 คือจำนวน bit
	fmt.Println(a)                         // 3.14

	e, _ := strconv.ParseInt("0110", 2, 64) // 2 คือ เลขฐานที่ส่งเข่้ามา
	fmt.Println(e)                          // 6

	i, _ := strconv.ParseUint("123", 10, 64)
	fmt.Println(i) // 123

	o, _ := strconv.Atoi("65") // แปลง str เป็น int
	fmt.Println(o)             // 65

	w := strconv.Itoa(65) // แปลง int เป็น str
	fmt.Println(w)        // 65

}

```