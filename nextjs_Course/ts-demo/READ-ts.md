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
Object คือ Record 
### ตัวอย่างการใช้ Record
```ts
type Address = {
    lat: number;
    lng: number
} 
```
or
```ts
type Address = Record<'lat' | 'lng',number> 

```
ทั้งสองได้ผลลัพธ์เหมือนกัน
>address เป็น Object ที่มี key lat,  lng และทั้งสองตัวนั้นมีข้อมูลคือ number

### ตัวอย่างการใช้ Partial
ถ้าครอบทับด้วย partial มันจะทำให้ทั้งสองตัว auto เติม "?" เอง
```ts
type Animal ={
    age: number;
}
type Person = Animal &{
    name: string;
    gender: 'male' | 'female';
    addresses: Record<'lat' | 'lng',number>[]; //เป็น array มีหลาย address or `{lat: number; lng: number }[];` ใส่แบบนี้เลยก็ได้
    socials?: Partial<{ 
        line: string;
        facebook: string 
}>
}
```
### ตัวอย่างการใช้ Pick กับ Omit
- pick คือการเลือก
- omit คือการละเว้น
อยากได้ข้อมูลคือ name and gender เท่านั้น เราจะเรียก name กับ gender ว่าเป็น basi info โดยใช้ `Pick` และถ้าอยากได้ตัวอื่นๆที่ไม่ใช่ name กับ gender ก็จะใช้ `Omit`
```ts
type Animal ={
    age: number;
}
type Person = Animal &{
    name: string;
    gender: 'male' | 'female';
    addresses: Record<'lat' | 'lng',number>[]; //เป็น array มีหลาย address or `{lat: number; lng: number }[];` ใส่แบบนี้เลยก็ได้
    socials?: Partial<{ //ถ้าครอบทับด้วย partial มันจะทำให้ทั้งสองตัว auto เติม "?" เอง
        line: string;
        facebook: string 
}>
}

type BacisInfo = Pick<Person, "name" |"gender">
type OtherInfo = Omit<Person, "name" | "gender">
```
> BacisInfo คือเลือกเอาแค่ name กับ gender
> OtherInfo คือเอาทุกตัวยกเว้น name กับ gender

---

ถ้าอยากรู้ว่าชนิดข้อมูลของ getTheme ที่คืนออกมานั้นคืออะไร

### ตัวอย่าง1 การแปลง type js --> ts
ใช้ ReturnType 
```js
function getTheme() {
    return {
        colors: {
            primary: '#eeffee',
            secondary: 'ffeeee'
        }
    }
}

type GetThemeReturn = ReturnType<typeof getTheme>
//อยากได้เฉพาะชนิดข้อมูลของ color
type Colors = GetThemeReturn['colors']//เป็นการเข้าถึง colors
//อยากได้ชื่อ key ใช้ keyof
type ColorKeys = keyof Colors
```

### ตัวอย่าง2 การแปลง type js --> ts
ถ้าอยากรู้ว่าพารามิเตอร์ที่เรารับเข้ามามีชนิดข้อมูลเป็นอะไร

```ts
function hello(a: number, b: string, c: boolean) {
    console.log(a, b, c)
}

type HelloParams = Parameters<typeof hello>
```
---
## 📍TypeScript Exercise
จงสร้างชนิดข้อมูลในภาษา TypeScript ชื่อ ButtonProps เพื่อไว้ใช้กับพารามิเตอร์ของฟังก์ชัน buildButton ฟังก์ชันนี้จะรับพารามิเตอร์ดังกล่าวไปประกอบการตัดสินใจสร้าง Button ตามสิ่งที่ส่งเข้ามาเป็นพารามิเตอร์

```ts
type ButtonProps = {
    color: string,
    text: string | {toString: () => string}
} & ( // เชื่อมด้วยและ แล้วเลือกอย่างใดอย่างนึ่ง
    | { variant: "outline"; borderWidth?: number}
    | { variant: "contain"; opacity?: number}
    | { variant?: never} // ไม่ต้องส่ง variant เข้ามาก็ได้และไม่สามารถระบุค่าอื่นเข้ามาได้
)

function buildButton(props?: ButtonProps) {
    // build button
  }

  buildButton();
buildButton({ variant: 'contain', color: '#4466ee', text: 'hello' });
buildButton({ variant: 'contain', color: '#4466ee', opacity: 0.6, text: 20 });
buildButton({ variant: 'outline', color: '#4466ee', text: 'hi' });
buildButton({
  variant: 'outline',
  color: '#4466ee',
  borderWidth: 2,
  text: 'lorem',
});
const person = {
  firstName: 'Somchai',
  lastName: 'Somset',
  toString() {
    return `${this.firstName} ${this.lastName}`;
  },
};
buildButton({ color: '#55ee11', text: person });
```