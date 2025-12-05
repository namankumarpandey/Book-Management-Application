import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

export default function AddBook({ fetchBooks }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
    status: "Available",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // loading/loader state

  function validateForm() {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "author is required";
    if (!form.genre.trim()) newErrors.genre = "genre is required";

    if (!form.publishedYear) {
      newErrors.publishedYear = "Published year is required";
    } else if (
      form.publishedYear < 0 ||
      form.publishedYear > new Date().getFullYear()
    ) {
      newErrors.publishedYear = "Enter a valid year (1960 - current year)";
    }

    if (!form.image.trim()) {
      newErrors.image = "Image URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    // Clear the error for this field as soon as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // CALL validateForm
    if (!validateForm()) {
      toast.success("Fix validation errors first");
      return;
    }

    try {
      setLoading(true); // start loader
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add book");

      await fetchBooks(); // refresh API data
      toast.success("Book added successfully!");
      navigate("/"); // Redirect back to home
    } catch (err) {
      console.log(err);
      toast.error("Error adding book");
    } finally {
      setLoading(false); // stop loader
    }
  }
  return (
    <div className="relative max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      {loading && (
        <div className="absolute inset-0 bg-opacity-40 flex justify-center items-center z-50 rounded-xl">
          <div className="w-12 h-12 border-4 border-t-green-600 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">➕ Add New Book</h2>

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
          type="number"
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}
