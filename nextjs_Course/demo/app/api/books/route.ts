import { generateBooks } from "@/utils/generator";

export const GET = () => {
  const books = generateBooks();

  return Response.json(books);
};
