async function updateBooks() {
    const res = await fetch('http://localhost:5151/books/2', {
        method: 'PATCH',
        body: JSON.stringify({
            title: 'Title#2',
            decs: 'Desc#2'
        }),// body คือส่งข้อมูลไปตามโครงสร้างของ db
        headers: {
            'Content-Type': 'application/json' //บ่งบอกว่าส่งเป็นอะไรไปในที่นี้ส่งเป็น json
        }
    })
    const books = await res.json()

    console.log(books)
} 

updateBooks()