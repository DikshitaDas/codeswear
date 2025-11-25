import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = ({ cart, subTotal }) => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    } else if (Object.keys(cart).length === 0) {
      router.push("/");
    }
    setIsLoading(false);
  }, [cart, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails && Object.keys(cart).length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No Order Found
          </h1>
          <p className="text-gray-600 mb-6">
            It looks like you don&apos;t have any recent orders.
          </p>
          <Link
            href="/"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div> 
      </div>
    );
  }

  const currentOrder = orderDetails?.items || cart;
  const orderTotal =
    orderDetails?.total ||
    Object.keys(currentOrder).reduce(
      (acc, key) => acc + currentOrder[key].price * currentOrder[key].qty,
      0
    );

  // Tracking data
  const steps = [
    { key: "Processing", label: "Processing", desc: "We received your order" },
    { key: "Shipped", label: "Shipped", desc: "Your order is on the way" },
    { key: "Delivered", label: "Delivered", desc: "Order delivered" },
  ];
  const currentStatus = orderDetails?.orderStatus || "Processing";
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.key.toLowerCase() === currentStatus.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />

      <div className="container mx-auto px-5 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Order Confirmation</h1>
          {orderDetails?.orderId && (
            <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              ID: {orderDetails.orderId}
            </span>
          )}
        </div>

        <div className="lg:flex lg:gap-6">
          {/* Items */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-lg p-6 mb-8 lg:mb-0">
            <h2 className="text-xl font-semibold mb-4">Items</h2>

            {Object.keys(currentOrder).length === 0 ? (
              <p className="text-center text-gray-500">No items in order</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">Product</th>
                      <th scope="col" className="px-6 py-3">Color</th>
                      <th scope="col" className="px-6 py-3">Size</th>
                      <th scope="col" className="px-6 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(currentOrder).map((itemCode) => (
                      <tr key={itemCode} className="border-b">
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                          {currentOrder[itemCode].name}
                        </td>
                        <td className="px-6 py-4">{currentOrder[itemCode].variant}</td>
                        <td className="px-6 py-4 bg-gray-50">{currentOrder[itemCode].size}</td>
                        <td className="px-6 py-4 text-right">
                          ₹{currentOrder[itemCode].price * currentOrder[itemCode].qty}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-6 py-4 text-left" colSpan={3}>Total</td>
                      <td className="px-6 py-4 text-right">₹{orderTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {orderDetails && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Order ID:</span>
                    <span className="ml-2 text-gray-600">#{orderDetails.orderId || "ORD" + Date.now()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Order Date:</span>
                    <span className="ml-2 text-gray-600">{new Date(orderDetails.orderDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {orderDetails.customerInfo && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>
                        <span className="ml-2 text-gray-600">{orderDetails.customerInfo.name}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2 text-gray-600">{orderDetails.customerInfo.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2 text-gray-600">{orderDetails.customerInfo.phone}</span>
                      </div>
                      <div>
                        <span className="font-medium">City:</span>
                        <span className="ml-2 text-gray-600">{orderDetails.customerInfo.city}</span>
                      </div>
                    </div>
                    {orderDetails.customerInfo.address && (
                      <div className="mt-2">
                        <span className="font-medium">Address:</span>
                        <span className="ml-2 text-gray-600">{orderDetails.customerInfo.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary Card with Tracking */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-6 h-max">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{orderTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>₹{orderTotal}</span>
            </div>

            {/* Tracking in Card */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Tracking</h4>
              <ol className="relative border-s border-gray-200 ms-3">
                {steps.map((step, idx) => {
                  const active = idx <= currentIndex;
                  return (
                    <li key={step.key} className="mb-6 ms-4">
                      <span className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ${active ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-500"}`}>
                        {idx + 1}
                      </span>
                      <h5 className={`font-semibold ${active ? "text-gray-900" : "text-gray-500"}`}>{step.label}</h5>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <Link href="/">
              <button className="w-full mt-6 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
