## 📍ติดตั้ง typescript 
1. ติดตั้ง package typescript
```cmd
pnpm add -D typescript
```
>ใช้ `-D` เพราะ ใช้ typescript แค่ตอนที่เรา dev

2. ติดตั้งไฟล์ tsconfig.json
```cmd
npx tsc --init
```
---
## 📍การประกาศชนิดข้อมูลให้กับ object{}

1. การใช้ Interface

### 📒ตัวอย่างการประกาศตัวแปร
```ts
interface Person {
    name: string;
    age: number;
    gender: 'male' | 'female';
    socials?: { 
        line?: string;
        facebook?: string 
    }
}

const somphong: Person = {
    name: 'Somphong',
    age: 22,
    gender: 'male'
}
```
> การใส่ `?` คือสิ่งนั้นเป็น obtional สิ่งนั้นจะมีหรือไม่มีก็ได้

### 📘ตัวอย่างการสืบทอด (extends)
Person extends age มาจาก Animal
```ts
interface Animal {
    age: number;
}

interface Person extends Animal{
    name: string;
    gender: 'male' | 'female';
    socials?: { // ใส่ ? คือสิ่งนั้นเป็น obtional สิ่งนั้นมีหรือไม่มีก็ได้
        line?: string;
        facebook?: string 
    }
}

const somphong: Person = {
    name: 'Somphong',
    age: 22,
    gender: 'male'
}
```
2. การใช้ type

### ตัวอย่างการประกาศตัวแปรโดยใช้ type
```js
type Animal ={
    age: number;
}

type Address = {
    lat: number;
    lng: number
}

type Person = Animal &{
    name: string;
    gender: 'male' | 'female';
    addresses: Address[]; //เป็น array มีหลาย address or `{lat: number; lng: number }[];` ใส่แบบนี้เลยก็ได้
    socials?: { // ใส่ ? คือสิ่งนั้นเป็น obtional สิ่งนั้นมีหรือไม่มีก็ได้
        line?: string;
        facebook?: string 
}
}

const somphong: Person = {
    name: 'Somphong',
    age: 22,
    gender: 'male',
    addresses: [{lat: 111, lng: 323}],
    socials: {
        line: "shomphong!! "
    }
}
```

### ตัวอย่างการประกาศตัวแปรโดยใช้ type กับ function
bar จะต้องส่งค่ามาทุกครั้งส่วน options จะมีหรือไม่มีก็ได้
```ts
interface Options {
    x: number;
    y: number;
}

function foo(bar: number, options?: Options){

}
foo(1, { x:1,y: 2})
```

### ตัวอย่าง1 รับชนิดข้อมูลได้มากกว่า 1 ชนิด <T> generic parameter
รับเป็น T ใดๆเข้า คือ generic parameter ความหมายก็คือ ต่อไปนี้เราสามารถแทนค่า T ตัวนี้ว่าอะไรก็ได้ แล้วเมื่อไหร่ที่เราส่ง array ของ number มันจะทราบทันที่ว่า T เป็น number และถ้าส่ง array ของ string มันจะทราบทันที่ว่า T เป็น string

```js
function concatAll<T>(arr: T[]) {
    let result = ``;

    for ( const i of arr){
        result += `-${i}`;
    }
    return result;
}

concatAll([1, 2, 3]);
concatAll(["a", "b", "c"])
```


### ตัวอย่าง2 รับชนิดข้อมูลได้มากกว่า 1 ชนิด <T> generic parameter
ใส่ extends เผื่อขยายความสามารถของ T
```js
function findById<T extends { id: number}>(items: T[], id: T['id']){
    return items.find((item) => item.id === id)
}

const products = [
    {id: 1 , title: "title#1"},
    {id: 2 , title: "title#2"},
    {id: 3 , title: "title#3"},
]

findById(products, 2) //    {id: 2 , title: "title#2"}
```

## 📍 Utility type
utility type คือตัวชนิดข้อมูลที่ตัวระบบ typescript เตรียมไว้ให้กับเรา เราสามารถนำมาแก้ปัญหาต่างๆได้อย่างมากมายโดยไม่ต้องเขียนเงื่อนไขให้ซับซ้อน

