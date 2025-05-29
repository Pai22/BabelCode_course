import { getBooks } from "@/utils/api";

const SsrPage = async () => {
  const books = await getBooks({ cache: "no-store" });

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};
export default SsrPage;
