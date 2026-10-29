
"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProductForm = {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  imageUrl: string;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  category: "Accessories",
  price: "",
  stock: "0",
  imageUrl: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#101113] px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-400";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load products.");
      }

      setProducts(data.products);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the product API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stock > 5) ||
        (stockFilter === "low" &&
          product.stock > 0 &&
          product.stock <= 5) ||
        (stockFilter === "out" && product.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    return result.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "stock-low") return a.stock - b.stock;
      if (sortBy === "name") return a.name.localeCompare(b.name);

      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock === 0
  ).length;

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setEditorOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
    });
    setError("");
    setMessage("");
    setEditorOpen(true);
  }

  function closeEditor() {
    if (saving) return;
    setEditorOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim(),
    };

    if (
      !payload.name ||
      !payload.description ||
      !payload.category ||
      !Number.isFinite(payload.price) ||
      payload.price <= 0 ||
      !Number.isInteger(payload.stock) ||
      payload.stock < 0
    ) {
      setError(
        "Enter a name, description, category, positive price and valid stock."
      );
      setSaving(false);
      return;
    }

    if (
      payload.imageUrl &&
      (!payload.imageUrl.startsWith("https://") ||
        payload.imageUrl.length > 2048)
    ) {
      setError("The image URL must start with https://.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not save the product.");
      }

      setMessage(
        editingId
          ? "Product updated successfully."
          : "Product created successfully."
      );
      setEditorOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This permanently removes it from the product database.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not delete the product.");
      }

      setMessage(`"${product.name}" was deleted.`);
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete product."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-white">
      <div className="mx-auto max-w-[1500px] space-y-8 p-5 sm:p-8 xl:p-10">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
              <Link href="/admin" className="hover:text-white">
                Control Center
              </Link>
              <span>/</span>
              <span className="text-neutral-300">Products</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Product operations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
              Manage your catalogue, pricing and stock from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void loadProducts()}
              disabled={loading}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh data"}
            </button>

            <button
              onClick={openCreateForm}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              + Add product
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total products",
              value: products.length,
              detail: "Catalogue records",
            },
            {
              label: "Stock units",
              value: totalStock.toLocaleString(),
              detail: "Across all products",
            },
            {
              label: "Low stock",
              value: lowStockCount,
              detail: "Between 1 and 5 units",
            },
            {
              label: "Out of stock",
              value: outOfStockCount,
              detail: "Requires replenishment",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-[#111214] p-5"
            >
              <p className="text-sm text-neutral-400">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                {stat.detail}
              </p>
            </div>
          ))}
        </section>

        {message && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-300"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111214]">
          <div className="border-b border-white/[0.08] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-lg font-semibold">Catalogue</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className={inputClass}
                />

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  aria-label="Filter by category"
                  className={inputClass}
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value)}
                  aria-label="Filter by stock"
                  className={inputClass}
                >
                  <option value="all">All stock levels</option>
                  <option value="in-stock">In stock (over 5)</option>
                  <option value="low">Low stock (1–5)</option>
                  <option value="out">Out of stock</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort products"
                  className={inputClass}
                >
                  <option value="newest">Newest first</option>
                  <option value="name">Name A–Z</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="stock-low">Lowest stock first</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-neutral-400">
              Loading catalogue...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="font-medium">
                {products.length === 0
                  ? "Your catalogue is empty"
                  : "No matching products"}
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                {products.length === 0
                  ? "Add your first product to begin building the catalogue."
                  : "Try changing your search or filters."}
              </p>
              {products.length === 0 && (
                <button
                  onClick={openCreateForm}
                  className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
                >
                  Create first product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#1a1b1e] text-xs text-neutral-500">
                            {product.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              "No image"
                            )}
                          </div>
                          <div className="max-w-xs">
                            <p className="font-medium text-neutral-100">
                              {product.name}
                            </p>
                            <p className="mt-1 truncate text-xs text-neutral-500">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-neutral-400">
                        {product.category}
                      </td>

                      <td className="px-6 py-5 font-medium">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-5 tabular-nums">
                        {product.stock}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs ${
                            product.stock === 0
                              ? "bg-red-500/10 text-red-300"
                              : product.stock <= 5
                                ? "bg-amber-500/10 text-amber-300"
                                : "bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          {product.stock === 0
                            ? "Out of stock"
                            : product.stock <= 5
                              ? "Low stock"
                              : "In stock"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditForm(product)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/10"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(product)}
                            className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="flex flex-col justify-between gap-2 text-xs text-neutral-600 sm:flex-row">
          <p>aX Control Center · Product operations</p>
          <p>Inventory value is not revenue or profit.</p>
        </footer>
      </div>

      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditor();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-editor-title"
            className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111214] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/[0.08] p-6">
              <div>
                <h2 id="product-editor-title" className="text-xl font-semibold">
                  {editingId ? "Edit product" : "Create product"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Product details are saved to MongoDB.
                </p>
              </div>

              <button
                onClick={closeEditor}
                disabled={saving}
                aria-label="Close product editor"
                className="rounded-lg px-3 py-2 text-neutral-400 hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-neutral-300">
                  Product name
                  <input
                    required
                    maxLength={160}
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    className={inputClass}
                    placeholder="e.g. Minimalist bracelet"
                  />
                </label>

                <label className="space-y-2 text-sm text-neutral-300">
                  Category
                  <input
                    required
                    maxLength={80}
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className={inputClass}
                    placeholder="Accessories"
                  />
                </label>

                <label className="space-y-2 text-sm text-neutral-300">
                  Price (INR)
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    className={inputClass}
                    placeholder="499"
                  />
                </label>

                <label className="space-y-2 text-sm text-neutral-300">
                  Stock quantity
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({ ...form, stock: event.target.value })
                    }
                    className={inputClass}
                    placeholder="10"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-sm text-neutral-300">
                Description
                <textarea
                  required
                  maxLength={5000}
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Describe the product accurately..."
                />
              </label>

              <label className="block space-y-2 text-sm text-neutral-300">
                Product image URL
                <input
                  type="url"
                  maxLength={2048}
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm({ ...form, imageUrl: event.target.value })
                  }
                  className={inputClass}
                  placeholder="https://..."
                />
                <span className="block text-xs text-neutral-500">
                  Optional. Use an image URL you have permission to use.
                </span>
              </label>

              {form.imageUrl.startsWith("https://") && (
                <div className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt="Product preview"
                    className="h-16 w-16 rounded-lg bg-white/5 object-cover"
                  />
                  <p className="break-all text-xs text-neutral-500">
                    Image preview · Check the image before saving.
                  </p>
                </div>
              )}

              {error && (
                <p role="alert" className="text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/[0.08] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
