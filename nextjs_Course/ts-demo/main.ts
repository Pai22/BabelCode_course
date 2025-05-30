// interface Animal {
//     age: number;
// }

// interface Person extends Animal{
//     name: string;
//     gender: 'male' | 'female';
//     socials?: { // ใส่ ? คือสิ่งนั้นเป็น obtional สิ่งนั้นมีหรือไม่มีก็ได้
//         line?: string;
//         facebook?: string 
//     }
// }

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

interface Options {
    x: number;
    y: number;
}

function foo(bar: number, options?: Options){

}
foo(1, { x:1,y: 2})

function findById<T extends { id: number}>(items: T[], id: T['id']){
    return items.find((item) => item.id === id)
}

const products = [
    {id: 1 , title: "title#1"},
    {id: 2 , title: "title#2"},
    {id: 3 , title: "title#3"},
]

findById(products, 2) //    {id: 2 , title: "title#2"}