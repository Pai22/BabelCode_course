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
