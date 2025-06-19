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

	(&e).addCourse("Go")
	fmt.Println(e.courses) // [Java C# Go]
}
