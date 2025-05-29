import { getBooks } from "@/utils/api";

const SsgPage = async () => {
  const books = await getBooks({ cache: "force-cache" });

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};
export default SsgPage;
