"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  media?: {
    id: string;
    url: string;
    thumbnailURL: string;
  };
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "media">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products", { params: { limit: 100 } });
      setProducts(res.data.docs || []);
      toast.success("Products loaded");
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete product", { id: toastId });
    }
  };

  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setNewProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        createdAt: product.createdAt,
      });
      setEditProductId(id);
      setIsModalOpen(true);
      toast("Editing product...");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0] ?? null);
      toast.success("Image selected");
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      createdAt: new Date().toISOString(),
    });
    setSelectedFile(null);
    setEditProductId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let mediaData = null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("alt", newProduct.name);

      try {
        const res = await axios.post("/api/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.doc?.id) {
          mediaData = res.data.doc;
        } else {
          throw new Error("Failed to get media ID from the response");
        }

        toast.success("Image uploaded");
      } catch (err) {
        console.error("Media upload failed:", err);
        toast.error("Image upload failed");
        return;
      }
    }

    try {
      if (editProductId) {
        await axios.patch(`/api/products/${editProductId}`, {
          ...newProduct,
          media: mediaData || undefined,
        });
        toast.success("Product updated");
      } else {
        await axios.post("/api/products", {
          ...newProduct,
          media: mediaData,
        });
        toast.success("Product added");
      }

      await fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Product save failed:", err);
      toast.error("Failed to save product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛍️ Products</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          className="w-full sm:max-w-sm border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            setIsModalOpen(true);
            resetForm();
            toast("Adding new product...");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Add Product
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editProductId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              />
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select Category</option>
                <option value="Phones">Phones</option>
                <option value="Laptops">Laptops</option>
                <option value="Tv">TV</option>
                <option value="Accessories">Accessories</option>
                <option value="Ipads">Ipads</option>
                <option value="Watches">Watches</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                    toast("Cancelled");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {editProductId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={9}>
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={9}>
                  No matching products.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr
                  key={product.id || index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    {product.media?.thumbnailURL ? (
                      <img
                        src={product.media.thumbnailURL}
                        alt={product.name}
                        className="h-12 w-12 object-fill rounded border"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">
                    ₹{product.price ? product.price.toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(product.id!)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
