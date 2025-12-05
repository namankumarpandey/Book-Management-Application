import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import EditBook from "./pages/EditBook";
import { useState, useEffect } from "react";
import AddBooks from "./pages/AddBooks";
import { API_URL } from "./api";
import { bookDetails } from "./data/BooksDetails";

function App() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <BrowserRouter>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              books={books}
              fetchBooks={fetchBooks}
              loading={loading}
              searchQuery={searchQuery}
            />
          }
        ></Route>

        {/* Add book Route */}
        <Route
          path="/add-book"
          element={<AddBooks fetchBooks={fetchBooks} />}
        />

        {/* Edit page Route */}
        <Route
          path="/edit-book/:id"
          element={<EditBook books={books} fetchBooks={fetchBooks} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
