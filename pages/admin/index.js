import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
    recentOrders: [],
  });
  const [chartData, setChartData] = useState([]);
  const [salesByCat, setSalesByCat] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in as admin");
      router.push("/admin/login");
      return;
    }
    loadDashboard(token);
  }, []);

  const loadDashboard = async (token) => {
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data);
      setChartData(data.ordersByMonth || []);
      setSalesByCat(Array.isArray(data.salesByCategoryMonth) ? data.salesByCategoryMonth : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load dashboard data");
    }
  };

  const ordersSeries =
    chartData.length > 0
      ? chartData.map((d) => ({ month: d.month, value: Number(d.sales) || 0 }))
      : [
          { month: "Jan", value: 0 },
          { month: "Feb", value: 0 },
          { month: "Mar", value: 0 },
        ];

  const months = ordersSeries.map((d) => d.month);
  const usersSeries = months.map((m, i) => ({
    month: m,
    value: Math.round((stats.usersCount || 0) * ((i + 1) / months.length)),
  }));

  const productsSeries = [
    {
      name: "Stock",
      value: stats.productsCount || 0,
      fill: "#0ea5e9",
    },
    {
      name: "Goal",
      value: Math.max(0, Math.round((stats.productsCount || 0) * 0.7)),
      fill: "#e5e7eb",
    },
  ];

  const kpis = [
    {
      label: "Total Sales",
      value: `₹${stats.totalSales}`,
      icon: "💰",
      accent: "from-emerald-500/90 to-emerald-600/90",
    },
    {
      label: "Orders",
      value: stats.ordersCount,
      icon: "🧾",
      accent: "from-blue-500/90 to-blue-600/90",
    },
    {
      label: "Products",
      value: stats.productsCount,
      icon: "📦",
      accent: "from-amber-500/90 to-amber-600/90",
    },
    {
      label: "Users",
      value: stats.usersCount,
      icon: "👥",
      accent: "from-purple-500/90 to-purple-600/90",
    },
  ];

  // Build stacked data per month with categories as keys
  const monthKeys = Array.from(new Set(salesByCat.map(d => d.month)));
  const cats = Array.from(new Set(salesByCat.map(d => d.category)));
  const stackedData = monthKeys.map(month => {
    const row = { month };
    cats.forEach(c => {
      const found = salesByCat.find(d => d.month === month && d.category === c);
      row[c] = found ? Number(found.sales) || 0 : 0;
    });
    return row;
  });
  const catColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6"]; // blue, green, amber, violet, red, teal

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="rounded-xl border border-gray-200 bg-white/95 backdrop-blur px-3 py-2 shadow-md">
        <div className="text-xs font-medium text-gray-700 mb-1">{label}</div>
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="capitalize">{p.name}:</span>
            <span className="font-semibold text-gray-900">₹{Number(p.value || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Dashboard">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900" />
        <div className="relative p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome back, Admin
              </h1>
              <p className="text-gray-200/90 text-sm">
                Here is your business snapshot today.
              </p>
            </div>
            <div className="hidden sm:flex gap-3">
              <Link
                href="/admin/orders"
                className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              >
                View Orders
              </Link>
              <Link
                href="/admin/products"
                className="px-3 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition"
              >
                Add Product
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* KPI CARDS */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 shadow-lg hover:shadow-xl transition"
          >
            <div className="rounded-2xl bg-white p-5 h-full">
              <div
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${kpi.accent} text-white flex items-center justify-center text-lg shadow-sm`}
              >
                {kpi.icon}
              </div>
              <div className="mt-3 text-sm text-gray-500">{kpi.label}</div>
              <div className="text-2xl font-semibold text-gray-900">
                {kpi.value}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* THREE-CHART GRID */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Orders (stacked by category) */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Orders revenue by category (monthly)</h3>
            <span className="text-xs text-gray-500">Stacked</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stackedData} barSize={22} barGap={6} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              {/* Gradients */}
              <defs>
                {cats.map((c, idx) => (
                  <linearGradient key={c} id={`grad-${c}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={catColors[idx % catColors.length]} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={catColors[idx % catColors.length]} stopOpacity={0.3} />
                  </linearGradient>
                ))}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="month" stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tickFormatter={(v)=>`₹${Number(v).toLocaleString()}`} />
              <Tooltip content={<CustomBarTooltip />} />

              {cats.map((c, idx) => (
                <Bar
                  key={c}
                  dataKey={c}
                  stackId="a"
                  fill={`url(#grad-${c})`}
                  radius={[6, 6, 0, 0]}
                  style={{ filter: 'url(#shadow)' }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-gray-600">
            {cats.map((c, idx) => (
              <div key={c} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: catColors[idx % catColors.length] }} />
                <span className="capitalize">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Area */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Users (area)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={usersSeries}>
              <defs>
                <linearGradient id="usersArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
              <Area type="monotone" dataKey="value" stroke="#9333ea" fillOpacity={1} fill="url(#usersArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders (replacing Products Pie) */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Recent Orders</h3>
          </div>
          <div className="max-h-[220px] overflow-auto pr-2">
            <ul className="space-y-3 text-sm">
              {stats.recentOrders.length === 0 ? (
                <li className="text-gray-500">No recent orders</li>
              ) : (
                stats.recentOrders.map((o) => (
                  <li key={o._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">#{o.orderId || o._id.slice(-6)}</div>
                      <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800">₹{o.amount}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        o.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
};

export default AdminHome;
