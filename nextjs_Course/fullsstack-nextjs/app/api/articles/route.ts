export const GET = () => {
  const articles = [{ id: 1 }, { id: 2 }];
  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
// การ new response จะทำให้เราสามารถ ส่งข้อมูลกลับไปได้พร้อมกับสามารถเขียน
// response status ที่เป็น http status กลับไปได้
