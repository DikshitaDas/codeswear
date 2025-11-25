import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        const res = await fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data.orders || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AdminLayout title="Orders">
      <div className="mb-6 flex items-center justify-between">
        <span></span>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
      </div>
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-6 py-4" colSpan={6}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td className="px-6 py-4" colSpan={6}>No orders found</td></tr>
              ) : (
                orders.map((o, idx) => (
                  <tr key={o._id} className={idx % 2 ? "bg-white" : "bg-gray-50 hover:bg-gray-100/60 transition-colors"}>
                    <td className="px-6 py-3 font-medium text-gray-900">{o.orderId || o._id}</td>
                    <td className="px-6 py-3 text-gray-700">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-gray-700">{o.products?.reduce((acc, p) => acc + (p.qty || 0), 0)}</td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-900">₹{Number(o.amount || 0)}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        o.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/orders?oid=${o.orderId || o._id}`} className="text-gray-800 hover:underline">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;


