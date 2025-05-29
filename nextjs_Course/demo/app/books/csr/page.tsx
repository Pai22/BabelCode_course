"use client";
import { getBooks } from "@/utils/api";
import { Book } from "@/utils/types";
import { useEffect, useState } from "react";

const CsrPage = () => {
  const [loading, setLoading] = useState(true);
  // ในขณะที่ทำงานอยู่บนฝั่ง server นั้นยังไม่ทำการโหลดเลยต้องใช้ true
  const [books, setBooks] = useState<Book[]>([]);

  const loadBooks = async () => {
    const books = await getBooks();

    setLoading(false);
    setBooks(books);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (books.length === 0) return <div>No books found.</div>;

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
};

export default CsrPage;
