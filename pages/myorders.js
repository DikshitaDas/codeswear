import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEmail = () => {
      if (typeof window === 'undefined') return null;
      const storedEmail = localStorage.getItem('user_email');
      if (storedEmail) return storedEmail.toLowerCase();
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1] || ''));
          const emailFromToken = payload?.user?.email;
          if (emailFromToken) return String(emailFromToken).toLowerCase();
        } catch {}
      }
      const lastOrderRaw = localStorage.getItem('lastOrder');
      if (lastOrderRaw) {
        try {
          const lo = JSON.parse(lastOrderRaw);
          const emailFromLastOrder = lo?.customerInfo?.email;
          if (emailFromLastOrder) return String(emailFromLastOrder).toLowerCase();
        } catch {}
      }
      return null;
    };

    const email = getEmail();
    if (!email) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/myorders?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load orders');
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load your orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-5 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">My Orders</h1>
          {/* <Link href="/"  className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors inline-block">Continue shopping</Link> */}
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading your orders...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Looks like you haven’t placed any orders.</p>
            <Link href="/" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => {
              const itemCount = order.products?.reduce((acc, p) => acc + (p.qty || 0), 0) || 0;
              const status = order.orderStatus || 'Processing';
              const badgeClass =
                status === 'Delivered'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : status === 'Shipped'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : status === 'Cancelled'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200';

              const thumb = order.orderThumb || '/home2.png';

              return (
                <div key={order._id} className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col">
                  <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb} alt="Order thumbnail" className="h-full w-full object-cover" />
                    <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full border ${badgeClass}`}>
                      {status}
                    </span>
                  </div>

                  <div className="mt-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">#{order.orderId || order._id}</h3>
                      <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Items</span>
                        <span className="font-medium">{itemCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount</span>
                        <span className="font-semibold">₹{order.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/orders?oid=${order.orderId || order._id}`} className="flex-1">
                      <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition text-sm">View</button>
                    </Link>
                    <Link href={`/product/${order.products?.[0]?.slug || ''}`} className="flex-1">
                      <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm">Buy Again</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;


