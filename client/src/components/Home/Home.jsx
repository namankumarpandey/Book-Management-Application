import { useEffect, useState } from "react";
import BookCards from "../Books/BookCards";
import SkeletonBooks from "../SkeletonBooks";
import { API_URL } from "../../api";

export default function Home({ searchQuery }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all books when app loads
  const fetchBooks = async () => {
    try {
      setLoading(true); // start loading
      const res = await fetch(API_URL);
      const data = await res.json();
      setBooks(data);
      setLoading(false); // stop loading
    } catch (err) {
      console.log("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // load on page load
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold text-center mb-6">Book Collection</h1>

      {loading ? (
        <SkeletonBooks />
      ) : (
        <>
          {filteredBooks?.length > 0 ? (
            <BookCards books={filteredBooks} fetchBooks={fetchBooks} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-semibold text-gray-600">
                No Book Found
              </h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}
