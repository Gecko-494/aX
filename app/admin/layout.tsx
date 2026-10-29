
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    section: "WORKSPACE",
    items: [
      { label: "Overview", href: "/admin", icon: "◫" },
      { label: "Products", href: "/admin/products", icon: "▦" },
      { label: "Orders", href: "/admin/orders", icon: "↗" },
      { label: "Inventory", href: "/admin/inventory", icon: "▤" },
    ],
  },
  {
    section: "BUSINESS",
    items: [
      { label: "Customers", href: "/admin/customers", icon: "◎" },
      { label: "Suppliers", href: "/admin/suppliers", icon: "⇄" },
      { label: "Analytics", href: "/admin/analytics", icon: "⌁" },
      { label: "Marketing", href: "/admin/marketing", icon: "✳" },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "⚙" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090a0c] text-[#f2f2f0]">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-white/[0.08] bg-[#0d0e10] transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/admin"
          className="flex h-[82px] items-center gap-3 border-b border-white/[0.08] px-6"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7e6e1] text-lg font-black text-black">
            aX
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide">
              CONTROL CENTER
            </span>
            <span className="mt-1 block text-[10px] tracking-[0.22em] text-white/40">
              COMMERCE OPERATIONS
            </span>
          </span>
        </Link>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          {navigation.map((group) => (
            <div key={group.section} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-white/35">
                {group.section}
              </p>

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" &&
                      pathname.startsWith(item.href + "/"));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${
                        active
                          ? "border border-white/[0.09] bg-white/[0.08] text-white"
                          : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span className="w-5 text-center text-base">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d9d7cf]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.08] p-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-medium">Development mode</span>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-white/40">
              Internal workspace. Admin authentication is not configured yet.
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[258px]">
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-white/[0.08] bg-[#090a0c]/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm lg:hidden"
            >
              ☰
            </button>
            <div>
              <p className="text-[10px] tracking-[0.18em] text-white/35">
                aX / ADMINISTRATION
              </p>
              <p className="mt-1 text-xs text-white/70">
                Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-white/40 sm:block">
              Workspace · Local
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-semibold">
              AX
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-70px)]">{children}</div>
      </div>
    </div>
  );
}
