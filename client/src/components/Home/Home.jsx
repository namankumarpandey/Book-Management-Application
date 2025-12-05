import BookCards from "../Books/BookCards";
import SkeletonBooks from "../SkeletonBooks";

export default function Home({ books, loading, fetchBooks, searchQuery }) {
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
              <h2 className="text-2xl font-semibold text-gray-600">No Book Found</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}
