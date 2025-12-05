import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useState } from "react";

// Required for accessibility
Modal.setAppElement("#root");

export default function BookCards({ books, fetchBooks }) {
  const navigate = useNavigate();

  // Track which book is being deleted
  const [modalOpen, setModalOpen] = useState(false);
  const [seletedBookId, setSelectedBookId] = useState(null);

  // Open Modal
  const openDeleteModal = (id) => {
    setSelectedBookId(id);
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedBookId(null);
  };

  // DELETE BOOK
  const deleteBook = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${seletedBookId}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Book deleted!");
      fetchBooks(); // refresh list
    } catch (err) {
      console.log("Delete error:", err);
      toast.error("Delete failed!");
    }
  };

  return (
    <>
      {/* BOOK CARDS */}
      <div className="w-full max-w-6xl mx-auto p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full h-60 overflow-hidden rounded-md">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h2 className="text-lg font-semibold mt-3">{book.title}</h2>
            <p className="text-sm text-gray-600">Author: {book.author}</p>
            <p className="text-sm text-gray-600">Genre: {book.genre}</p>

            <p className="mt-3 text-sm font-medium text-gray-700">
              Published: {book.publishedYear}
            </p>

            <p className="mt-3 text-sm font-medium text-gray-700">
              Status: {book.status}
            </p>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate(`/edit-book/${book._id}`)}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => openDeleteModal(book._id)}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        overlayClassName="fixed inset-0 bg-black/30 flex justify-center items-center"
        className="bg-white p-5 rounded-xl shadow-lg max-w-sm w-full"
      >
        <h2 className="text-xl font-semibold mb-3 text-center">
          Confirm Delete
        </h2>

        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to delete this book?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={deleteBook}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
