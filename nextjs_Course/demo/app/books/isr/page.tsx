import { getBooks } from "@/utils/api";

const IsrPage = async () => {
  const books = await getBooks({ next: { revalidate: 10 } });

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};
export default IsrPage;
