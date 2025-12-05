import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { useState, useEffect } from "react";
import { API_URL } from "./api";
import { bookDetails } from "./data/BooksDetails";
import BookForm from "./components/BookForm";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />}></Route>

        {/* Add book Route */}
        <Route path="/add-book" element={<BookForm />} />

        {/* Edit page Route */}
        <Route path="/edit-book/:id" element={<BookForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
