## 📍สร้าง node
ใช้คำสั่งข้างล่างแล้วจะได้ไฟล์ package.json
```cmd 
pnpm init 
```

ตัว nodeJS มีระบบ module อยู่ 2 รูปแบบ
1. commonJS เวลาใช้จะใช้ประโยค require กับตัว module export
2. ES module (.mjs) เป็นรูปแบบใหม่โดยจะเรียนในคอร์สนี้ 
    - รันไฟล์ .mjs ใช้คำสั่ง `node (file name)` หรือ ใช้คำสั่ง `pnpm dev` แต่ต้องไป setting ที่ไฟล์ package.json
    ```json
      "scripts": {
        "dev": "node --watch main.mjs",
        // --watch เมื่อไฟล์เปลียนแปลงมันจะทำการรันใหม่
      },
    ```
---

## 📍var let const
- var ทำงานอยู่ภายใต้ func ใช้ได้หมด
- const ทำงานอยู่ภายใต้ปีกกาเปิด-ปิด {_} ไม่สามารถเปลี่ยนค่าตัวแปรได้และกำหนดตัวแปรซ้ำไม่ได้
- let ทำงานอยู่ภายใต้ปีกกาเปิด-ปิด {_} เปลี่ยนค่าตัวแปรได้และไม่สามารถกำหนดตัวแปรซ้ำได้
---
## 📍Object{} ลำดับไม่สำคัญ
```js
const person = {
    name: 'Somchai',
    age: 24,
    sex: 'female',
    socials: {
        line: 'somchai123',
        facebook: 'somchai.fb',
    }
}

const { sex: gender = 'male', age, name, socials: { line, facebook } } = person
//sex: gender = 'male'  เป็นการกำหนดค่าเริ่มต้น
console.log(gender, age, name, line, facebook)
```
---
## 📍Array[] ลำดับสำคัญ

```js
const  langs = ['TH', 'CN','EN']

const [th,,en] = langs

console.log(th, en);
```
---
## 📍Spread Operator
การดำเนินการสำหรับการกระจายโครงสร้างข้อมูลเดิมเพื่อเอามาใส่แล้วเกิดเป็นโครงสร้างใหม่

1. แบบ Array[]
```js 
const nums = [2, 4, 6]
const nums2 = [8, 10]

const result = [...nums, 7 , ...nums2]

console.log(result) // [2, 4, 6, 7, 8, 10]
```
2. แบบ Object{} 
key ใดๆไม่สามารถมีชื่อซ้ำกันได้
```js
const obj1 = { a: 1, b: 2, c: 3 }
const obj2 = { a: 4, d: 5, m: 6 }

const result = { ...obj1, ...obj2}

console.log(result) // { a: 4, b: 2, c: 3, d: 5, m: 6 }
```
> หมายเหตุ: a: 1 ของ obj1 หายไปเพราะ obj2 ก็มี a เหมือนกันจึงไปแทนที่เพราะ key ไม่สามารถซ้ำกันได้
---

## 📍 Rest Operator
คล้ายกับ Spread Operator แต่เป็น Operator สำหรับการดึงค่าที่เหลือออกมา

1. แบบ Array[]
```js
const nums = [1, 2, 3]

const [first, ...rest]  = nums

console.log(first) // 1
console.log(rest)  // [2, 3]
```
2. แบบ Object{} 
```js
const book = {
    id: 1,
    title: "Title #1",
    desc: "Description #1",
}

const { id, ...rest } = book;

console.log(id); // 1
console.log(rest); // { title: 'Title #1', desc: 'Description #1' }
```
> หมายเหตู: ทั้งสองตัวต้องดึงบางอย่างออกไปก่อนถึงจะมีค่าที่เหลือทำ `[...rest, first,]` or `{...rest, id}` แบบนี้ไม่ได้

### 📘 ตัวอย่างเสริม
1. ตัวอย่างการใช้ Math 
```js
const nums = [8, 4, 1, 3, 0]
console.log(Math.min(...nums)) // 0 
```
> ถ้าใส่ `nums` เฉยๆมันจะได้ Nan มาเพราะมันใส่ไปทั้ง array ต้องกระจาย `...nums`

2. ตัวอย่างการใช้กับ function 
```js
function min(...nums) {
    console.log(nums);
}

min(1,2,3) // [ 1, 2, 3 ]
```

3. การเรียกใช้ Opject กับ function
```js
function printSocials(person) {
    const { socials: {line,facebook}} = person;
    console.log(line,facebook)
}

const person = {
    name: 'Sam',
    age : 30,
    socials: {
        line: 'sam_line',
        facebook: 'sam_facebook',   
    }
}

printSocials(person); // Output: sam_line sam_facebook
```
---
## 📍 String: Template Literal
- Template Literal
  `Hello, ${name}!` ใช้เครื่องหมาย (``)
- Interpolation
  `Hello, ${name}!`เป็นการเอาตัวแปรไปแทรกในเครื่องหมาย (``) คือ `${name}`
  มันจะประมวลผลใน `${__}` มาแล้วถ้าใส่ `${1+1}` ก็จะได้ `2` ออกมา
  
```js
const name = 'Smchai'

const str = `Hello, ${name}!`
console.log(str); //Hello, Smchai!
```
  การใช้งานของ Boolean
- And && ถ้าเป็นข้างหน้าเป็น true จะได้ข้างหลังออกมาเสอม 
- Or || ถ้าเป็นข้างหน้าเป็น false จะได้ข้างหลังออกมาเสอม 
```js
console.log(true && true); // true
console.log(true && false); // false    
console.log(false && true); // false
console.log(false && false); // false
console.log("======================");
console.log(true || true); // true
console.log(true || false); // true
console.log(false || true); // true
console.log(false || false); // false

console.log("======================");

console.log(true && 10); // 10
console.log(false || 20); // 20

const hasError = true
const person = {
    age: 30,
}
// person.sex => undefined => false
const gender = person.sex || 'male' // male

console.log(gender)
```

---
## 📍Function
1. normal Function
```js
function add(a,b) {
  return a + b
}
```
2. Arrow Function
function คือ object ต้องมีตัวแปรมาชี้ ดังตัวอย่างคือ `add`
```js
const add = (a,b) => {
    return a + b
}

```

---
## 📍map filter
การใช้งาน method ในตัวของ array

### method คือ function ที่ไปปราฏดใน Object{}
ยกตัวอย่าง object person มี method printDetails อยู่
```js
const person = {
    name: 'Pai',
    age: 22,
    printDetails: function () {
        console.log(this.name, this.age)
    }
    // ลดรูป
    // printDetails() {
    //     console.log(this.name, this.age)
    // }
}

person.printDetails()
```
### ตัวอย่างการ map, filter และ find
- map จะคืนค่าออกมาทุกตัว
- filter จะคืนค่าออกมาบางตัว สิ่งที่คืนออกจากตัว function จะต้องเป็นค่า boolean
- เอาตัวแรกที่เจอ คือถ้าถูกเงื่อนไขเป็นตัวแรกก็จะเอาอันนั้นเลย

```js
const nums = [1, 2, 3, 4, 5]

const r1 = nums.map(n => n * 2)
const r2 = nums.filter(n => (n % 2 ===0))
const r3 = nums.find(n => (n % 2 ===0))


console.log(nums,r1)// [ 1, 2, 3, 4, 5 ] [ 2, 4, 6, 8, 10 ]
console.log(nums,r2)// [ 1, 2, 3, 4, 5 ] [ 2, 4 ]
console.log(nums,r3)// [ 1, 2, 3, 4, 5 ] 2
```

---
## 📍 ES Module
การแบ่งแยกไฟล์ออกในแต่ละไฟล์จะเรียกว่า module
การเรีกใช้งานแต่ละ module ภายใน main นั้นมี 2 แบบ
1. Name export
export แบบมีชื่อ คือเติม `export` นำหน้าเลย

### File: main.mjs
```js
import * as circle from './circle.mjs'
import * as triangle from './triangle.mjs'
// import { DEFAULT_CORLOR } from './circle.mjs'

console.log(circle.PI, circle.DEFAULT_CORLOR,triangle.DEFAULT_CORLOR)
// 3.14 white white
```

### File: circle.mjs
```js
export const DEFAULT_CORLOR = 'white'
export const PI = 3.14

class Circle {}

```
### File: triangle.mjs
```js
export const DEFAULT_CORLOR = 'white'

class Tiangle  {}
```
> หมายเหตุ: ถ้าไม่ใช้ `*` ชื่อมันจะซ้ำทำให้ไม่รู้ว่าเราเรียกใช้มาจากไฟล์ไหน

2. Default export 
คือการเติมคำว่า `export defalut` อยู่ข้างหน้า แต่มันมีได้แค่อันเดียวใน 1 ไฟล์
- การ import จะใส่ชื่อไปตรงๆห้ามมี `{}` ใช้ชื่ออะไรก็ได้เพราะเป็นการเรียก default
### File: main.mjs
```js
// circle.mjs
// export default class Circle {}

import C from './circle.mjs'
console.log(Circle) // [class Circle]

```
> หมายเหตุ: ถ้ามีการ import คู่กันต้องเอา default ขึ้นก่อนเสมอ `import C ,* as circle from './circle.mjs'`

---
## 📍 async and fetch api 
setTimeout คือ function ที่เกี่ยวข้องกับเวลา

```js
setTimeout(() => console.log(1), 1_500) // 1.5 วิ
setTimeout(() => console.log(2), 1_00) // 1 วิ
setTimeout(() => console.log(3), 2_000) // 2 วิ
```

1. ใช้ then
เมื่อมีการ respons มาจะใช้ then และเมื่อเกิดก error จะใช้ catch
```js
fetch('/api/v1/books')
.then(res => ...)
.catch(err => ...)
```
2. ใช้ async กับ await

```js
const fetchBooks = async () => {
  const res = await fetch('/api/v1/books')
  // ... การทำงานขั้นต่อไป
  console.log(res)
}
fetchBooks()
```