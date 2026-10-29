
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type ApiResponse = {
  success: boolean;
  count: number;
  products: Product[];
  message?: string;
};

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOverview() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      });
      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not load store data.");
      }

      setProducts(data.products);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load store data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  );

  const outOfStock = products.filter((product) => product.stock === 0);

  const catalogueValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-white/40">
            BUSINESS OVERVIEW
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Command Center<span className="text-white/35">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
            Your store operations, catalogue health and next actions in one place.
          </p>
        </div>

        <button
          onClick={() => void loadOverview()}
          disabled={loading}
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm transition hover:bg-white/[0.05] disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "↻ Refresh data"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Catalogue products"
          value={loading ? "—" : products.length.toLocaleString("en-IN")}
          detail="Products saved in MongoDB"
          icon="▦"
        />
        <MetricCard
          label="Stock units"
          value={loading ? "—" : totalStock.toLocaleString("en-IN")}
          detail="Combined recorded quantities"
          icon="▤"
        />
        <MetricCard
          label="Low stock"
          value={loading ? "—" : lowStock.length.toString()}
          detail="Products with 1–5 units"
          icon="!"
        />
        <MetricCard
          label="Out of stock"
          value={loading ? "—" : outOfStock.length.toString()}
          detail="Products with zero units"
          icon="○"
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-white/40">
                CATALOGUE INTELLIGENCE
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Inventory snapshot
              </h2>
            </div>
            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50">
              Live data
            </span>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/[0.035] p-4">
              <p className="text-xs text-white/45">Recorded catalogue value</p>
              <p className="mt-3 text-2xl font-semibold">
                {loading
                  ? "—"
                  : `₹${catalogueValue.toLocaleString("en-IN")}`}
              </p>
              <p className="mt-2 text-[11px] leading-5 text-white/35">
                Listed price × recorded stock. Not revenue or profit.
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.035] p-4">
              <p className="text-xs text-white/45">Categories represented</p>
              <p className="mt-3 text-2xl font-semibold">
                {loading
                  ? "—"
                  : new Set(
                      products.map((product) => product.category)
                    ).size}
              </p>
              <p className="mt-2 text-[11px] text-white/35">
                Based on saved product categories
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <InventoryBar
              label="In stock"
              count={products.filter((product) => product.stock > 5).length}
              total={products.length}
              color="bg-emerald-400"
              loading={loading}
            />
            <InventoryBar
              label="Low stock"
              count={lowStock.length}
              total={products.length}
              color="bg-amber-400"
              loading={loading}
            />
            <InventoryBar
              label="Out of stock"
              count={outOfStock.length}
              total={products.length}
              color="bg-red-400"
              loading={loading}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7">
          <p className="text-[10px] tracking-[0.2em] text-white/40">
            OPERATIONS
          </p>
          <h2 className="mt-2 text-xl font-semibold">Quick actions</h2>
          <p className="mt-2 text-sm leading-6 text-white/45">
            Jump straight into the areas you can manage today.
          </p>

          <div className="mt-6 space-y-3">
            <QuickAction
              href="/admin/products"
              title="Manage products"
              description="Review your catalogue and add products"
              symbol="↗"
            />
            <QuickAction
              href="/admin/products"
              title="Review inventory"
              description="Check recorded stock quantities"
              symbol="▤"
            />
            <QuickAction
              href="/admin/products"
              title="Add a product"
              description="Open the product creation form"
              symbol="+"
            />
          </div>

          <div className="mt-6 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
            <p className="text-xs font-medium text-amber-200">
              Development status
            </p>
            <p className="mt-2 text-xs leading-5 text-white/45">
              Orders, payments, supplier integrations and revenue analytics
              will appear here when their real backend modules are built.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-white/40">
              RECENT CATALOGUE
            </p>
            <h2 className="mt-2 text-xl font-semibold">Latest products</h2>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-white/65 transition hover:text-white"
          >
            View all products →
          </Link>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-white/40">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="mt-6 text-sm text-white/40">
            No products found. Add your first product to populate this section.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs text-white/40">
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="py-3 pl-4 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-white/[0.05] last:border-0"
                  >
                    <td className="py-4 pr-4 font-medium">{product.name}</td>
                    <td className="px-4 py-4 text-white/50">
                      {product.category}
                    </td>
                    <td className="px-4 py-4">{product.stock}</td>
                    <td className="py-4 pl-4 text-right">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-8 text-[11px] leading-5 text-white/30">
        aX Control Center · Inventory figures reflect saved catalogue data.
        This development dashboard is not yet secured for public deployment.
      </p>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/[0.16]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-sm text-white/70">
          {icon}
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-white/35">{detail}</p>
    </div>
  );
}

function InventoryBar({
  label,
  count,
  total,
  color,
  loading,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  loading: boolean;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-white/55">{label}</span>
        <span className="text-white/70">
          {loading ? "—" : `${count} / ${total}`}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${loading ? 0 : percentage}%` }}
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  symbol,
}: {
  href: string;
  title: string;
  description: string;
  symbol: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-white/[0.07] p-4 transition hover:border-white/20 hover:bg-white/[0.035]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-lg transition group-hover:bg-white/10">
        {symbol}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-white/40">
          {description}
        </span>
      </span>
      <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
        →
      </span>
    </Link>
  );
}
