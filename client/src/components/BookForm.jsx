import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BookForm() {
  const { id } = useParams(); // if id -> Edit Mode
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit ? true : false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
    status: "Available",
    image: "",
  });

  // If Edit Mode -> fetch existing book
  useEffect(() => {
    if (!isEdit) return;

    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Book not found");

        const data = await res.json();
        setForm(data);
      } catch (err) {
        toast.error("Book not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [id]);

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

  // Input handler
  function handleChange(e) {
    const { name, value } = e.target;

    // Clear the error for this field as soon as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    setForm({ ...form, [name]: value });
  }

  // Submit (Add or Edit)
  async function handleSubmit(e) {
    e.preventDefault();

    // CALL validateForm
    if (!validateForm()) {
      toast.success("Fix validation errors first");
      return;
    }
    try {
      setLoading(true); // start loader

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_URL}/${id}` : API_URL;

      const body = isEdit
        ? JSON.stringify({ ...form, _id: undefined })
        : JSON.stringify(form);

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body,
      });

      if (!res.ok) throw new Error(isEdit ? "Update failed" : "Add failed");

      toast.success(
        isEdit ? "Book Updated successfully!" : "Book added successfully!"
      );
      navigate("/"); // Redirect back to home
    } catch (err) {
      console.log(err);
      toast.error("something went wrong");
    } finally {
      setLoading(false); // stop loader
    }
  }

  // Loader for Edit Mode
  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="relative max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      {/* Loader overlay when submitting */}
      {loading && (
        <div className="absolute inset-0 bg-opacity-40 flex justify-center items-center z-50 rounded-xl">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "✏️ Edit Book" : "➕ Add New Book"}
      </h2>

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
          {isEdit ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
}
