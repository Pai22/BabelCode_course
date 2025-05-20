// # ตัวแปร var let const

// function foo(){
//     var a = 1;
//     var b = 2;

//     if(b > a){
//         var c = 3;
//     }
//     console.log(c);
// }
// foo();
//--------------------------------------------------

// # Template String

// const name = "John Doe";
// const msg = "Hello, " + name + "!";
// console.log(msg);
// console.log(`Hello, ${name}!`)
//--------------------------------------------------

// # object array

// const obj = {
//     a: 1,
//     b: 2
// }
// console.log(obj.a,obj["a"]);
//--------
// const name = "Jo Jo";

// const dog = {
//     name ,// เขียนเต็มๆได้ name: name,
//     walk() { // walk:function(){...} แบบเต็ม
//         console.log("Walking...");
//     },
// };

// dog.walk();
// console.log(dog.name);
//--------
// const obj = {
//     a: 1,
//     b: 2,
// };
// console.log(Object.keys(obj)); // ['a', 'b']
// console.log(Object.values(obj)); // [1, 2]
// console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]
//--------------------------------------------------

// # Destructuring

// let person = {
//     age: 24,
//     gender: "male",
//     name: {
//         firstName: "firstName",
//         lastName: "lastName",
//     },
// };

// const { age, gender, name} = person;
// const { firstName, lastName } = name;
// console.log(age,gender, name, firstName, lastName);
// (ย่อ)
// const {
//     age,
//     gender,
//     name:{ lastName, firstName },
// } = person 
// console.log(age,gender, firstName, lastName);
// แปลี่ยนชื่อตัวแปร
// const somchai = {
//     name: "Somchai",
//     sex: "female",
// };

// const { name, sex: gender} = somchai; //{ name, sex: gender = "male"} กำหนดค่าเริ่มต้นเป็น male
// console.log(name,gender);
//--------
// const arr = [1, 2, 3]
// const [first, sexond, third] = arr
// console.log(first, sexond, third);
//--------------------------------------------------

// #Optional Chaining

// const person = {
    // name: 'Smchai',
    // age: 24,
    // socials:{
    //     facebook: 'somchai24'
    // }
// }

// console.log(person?.socials?.facebook); // การใส่ ? เป็นการเช็คว่ามีค่าหรือไม่ ถ้าไม่มีให้ return undefined
//--------------------------------------------------

// #spread operator คือจุดไข่ปลา 3 จุดเพื่อทำการ copy object หรือ array
// const obj1 = { a: 1, b: 2};
// const obj2 = { c: 3, d: 4};
// const obj3 = { ...obj1, ...obj2 };
// console.log(obj3);

// const arr1 = [1, 2, 3];
// const arr2 = [4, 5, 6];
// const arr3 = [...arr1, 9, ...arr2];
// console.log(arr3);

// const result = Math.min(9, 2, 16, 1, 3)
// console.log(result); // 1

//const arr = [9, 2, 16, 1, 3]
//const result = Math.min(...arr) //ถ้าไม่ใช้ spread operator จะมองว่าใส่่ [9, 2, 16, 1, 3] มันเลยไม่ได้
//console.log(result); // 1
//--------------------------------------------------

// # Arrow function คือ function ที่ไม่มีชื่อ แต่ใช้เป็นตัวแปรแทน

// function foo(a){
//     return a + 1;
// }
// const foo = (a) => { 
//     return a + 1;
// }

// const getName = ({ name }) => name //or person => person.name

// console.log(getName({
//     name: "Somchai",
//     age: 24,
// }))
//--------------------------------------------------

// # Map filter

// const arr = [1, 2, 3, 4]
// console.log(arr.filter(i => i % 2 === 0)); // [2, 4] filter จะคืนค่า array ที่ตรงตามเงื่อนไขที่กำหนด
// console.log(arr.map(i => i % 2 === 0)); // [false, true, false, true] map จะคืนค่า array ที่มีขนาดเท่ากับ array เดิม แต่ค่าที่ได้จะเป็นค่าที่เรากำหนด
//--------------------------------------------------

// # short circuit evaluation
// console.log(true && true); // true
// console.log(true && false); // false
// console.log(true && 2 ); // 2
// hasError && <div>{errorMessage}</div> ถ้า hasError เป็น true จะ return <div>{errorMessage}</div> ถ้า false จะ return false
//--------------------------------------------------

// # es modules ต้อง install pkg ที่ชื่อว่า "esm" ก่อน (yarn add esm) เพื่อที่จะใช้ import export ได้ es modules ได้ 
// ต้องแก้ไข package.json ให้เป็นแบบนี้
// "scripts": {
//     "start": "node -r esm index.js",
//     "dev": "nodemon -r esm index.js"
//   },
// มี 2 แบบ 
// 1. Default
// import C,  * as circle  from './circle.js'; // ใช้ชื่ออะไรก็ได้ถ้า import default 
// console.log(C,circle.PI); // class Circle 3.14
// 2. Name Exports คือการ export แบบมีชื่อ
// import { DEFAULT_COLOR } from './dog.js';
// import * as dog from './dog.js';
// import * as cat from './cat.js';
// console.log(dog.DEFAULT_COLOR); // white
// console.log(cat.DEFAULT_COLOR); // white
//--------------------------------------------------

// # async await จะมี callback function อนยู่ถ้าเวลาครบแล้วค่อยปลุกให้ทำงาน
// ติดตั้ง axios (yarn add axios)
// import axios from 'axios';


// console.log(result); // Promise { <pending> } คือ api เป็นการทำงานแบบ async
// async function getPosts(){// ถ้า function มีการทำงานที่เกี่ยวข้อง async จะต้องใช้ async นำหน้า
//     const result = await axios.get("https://jsonplaceholder.typicode.com/posts")// ดึงข้อมูลจาก url ที่ระบุ และโค้ดมี่อยู่ใน async มีการทำงานแบบ async เราจะใส่ await นำหน้า
    // ถ้าไม่ใส await มันจะไม่ทำรอ จะกระโดดไปทำบรรทัดถัดไปเลย
//     console.log(result.data);
// }

// getPosts();
//--------------------------------------------------

// # การเข้าถึงด้วย axios

// import axios from "axios";

// async function getPosts(){
//     try{
//         const result = await axios.get("https://jsonplaceholder.typicode.com/posts");
//         console.log(result.data.filter(post => post.userId === 1).map(post => post.title)); // filter จะกรองข้อมูลที่ userId = 1 และ map จะดึงเฉพาะ title ออกมาของ userId = 1 ออหกมา
//     }catch(error){
//         if(error.response){
//             console.log(error.response.status); // 404
//             console.log(error.response.statusText); // {message: "Not Found"}
//         }
//     }
// }

// getPosts();
//--------------------------------------------------

// # separate api and ui 
// create folder api
// yarn init
// yarn add json-server ทำให้ที่ในการ mock api คือการสร้าง api ขึ้นมาเองอย่างง่ายๆได้ ไม่เอาไปใช้บน production