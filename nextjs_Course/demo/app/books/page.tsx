import { generateBooks } from "@/utils/generator";
// render มาจาก server

const BooksPage = () => {
  const books = generateBooks();
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};
export default BooksPage;
