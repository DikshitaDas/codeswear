import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      active
        ? "bg-gray-100 text-gray-900 border border-gray-200"
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    <span className="text-base">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const AdminLayout = ({ children, title = "Admin" }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      setIsAdmin(payload?.user?.role === 'admin');
    } catch {}
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Admins only</h1>
          <p className="text-gray-600">You don’t have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const path = router.pathname;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/90 backdrop-blur border-r border-gray-200 min-h-screen sticky top-0 hidden md:flex md:flex-col">
          <div className="p-5 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-900">Admin</h2>
            <p className="text-xs text-gray-500">Control Center</p>
          </div>

          <nav className="p-3 space-y-1 text-sm flex-1">
            <NavLink href="/admin" icon="🏠" label="Overview" active={path === "/admin"} />

            <div className="pt-3 pb-1 text-[11px] uppercase tracking-wide text-gray-500 px-3">Management</div>
            <NavLink href="/admin/orders" icon="🧾" label="Orders" active={path.startsWith("/admin/orders")} />
            <NavLink href="/admin/products" icon="📦" label="Products" active={path.startsWith("/admin/products")} />
            <NavLink href="/admin/users" icon="👤" label="Users" active={path.startsWith("/admin/users")} />

            <div className="mt-4 border-t border-gray-200"></div>
            <div className="px-3 pt-3 text-[11px] uppercase tracking-wide text-gray-500">Shortcuts</div>
            <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <span className="text-base">🛍️</span>
              <span className="text-sm font-medium">Storefront</span>
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-10">
            <div className="px-5 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            </div>
          </header>
          <div className="p-5 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


