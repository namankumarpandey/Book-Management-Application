import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import toast from "react-hot-toast";

export default function EditBook({ fetchBooks }) {
  const { id } = useParams(); // get book id from URL
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch single book from API
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        setLoading(true); // start Loader
        const res = await fetch(`${API_URL}/${id}`);

        if (!res.ok) throw new Error("Book not found");

        const data = await res.json();
        // set form to fetched book
        setForm(data);
      } catch (err) {
        console.log(err);
        alert("Book not found or API error");
        navigate("/"); // go back to home if error
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchBook();
  }, [id, navigate]);

  // Validation function
  function validateForm() {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (!form.genre.trim()) newErrors.genre = "Genre is required";

    if (!form.publishedYear) {
      newErrors.publishedYear = "Published year is required";
    } else if (
      form.publishedYear < 0 ||
      form.publishedYear > new Date().getFullYear()
    ) {
      newErrors.publishedYear = "Enter a valid year";
    }

    if (!form.image.trim()) {
      newErrors.image = "Image URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle form input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit updated book
  async function handleSubmit(e) {
    e.preventDefault();

    // Call Validate Form
    if (!validateForm()) {
      toast.success("Fix validation errors first");
      return;
    }

    try {
      setLoading(true); // start loader
      const { _id, ...bookWithoutId } = form;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookWithoutId),
      });

      if (!res.ok) throw new Error("Failed to update book");

      toast.success("Book updated successfully");
      // Refresh latest API data BEFORE navigating
      if (typeof fetchBooks === "function") {
        await fetchBooks();
      }
      navigate("/"); // go back to home
    } catch (err) {
      console.log(err);
      toast.error("Error updating book");
    } finally {
      setLoading(false); // stop loader
    }
  }
  if (loading && !form) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!form) return null;

  return (
    <div className="relative max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      {/* Loader overlay when submitting */}
      {loading && (
        <div className="absolute inset-0 bg-opacity-40 flex justify-center items-center z-50 rounded-xl">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">✏️ Edit Book</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <input
          type="text"
          name="author"
          placeholder="Author"
          className="w-full border p-2 rounded"
          value={form.author}
          onChange={handleChange}
        />
        {errors.author && (
          <p className="text-red-500 text-sm">{errors.author}</p>
        )}

        <input
          type="text"
          name="genre"
          placeholder="Genre"
          className="w-full border p-2 rounded"
          value={form.genre}
          onChange={handleChange}
        />
        {errors.genre && <p className="text-red-500 text-sm">{errors.genre}</p>}

        <input
          type="text"
          name="publishedYear"
          placeholder="Published Year"
          className="w-full border p-2 rounded"
          value={form.publishedYear}
          maxLength={4}
          onChange={(e) => {
            let value = e.target.value;

            // except digits → ignore update
            if (isNaN(value)) return;

            // Prevent typing more than 4 digits
            if (value.length > 4) return;

            setForm({ ...form, publishedYear: value });
          }}
        />
        {errors.publishedYear && (
          <p className="text-red-500 text-sm">{errors.publishedYear}</p>
        )}

        <select
          name="status"
          className="w-full border p-2 rounded"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
        </select>

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="w-full border p-2 rounded"
          value={form.image}
          onChange={handleChange}
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Book
        </button>
      </form>
    </div>
  );
}
