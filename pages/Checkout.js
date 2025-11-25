import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const Checkout = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
    paymentMethod: "cod",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skipCartRedirect, setSkipCartRedirect] = useState(false);

  // Redirect if cart is empty (only if not skipping)
  useEffect(() => {
    if (Object.keys(cart).length === 0 && !skipCartRedirect) {
      router.push("/");
    }
  }, [cart, router, skipCartRedirect]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handlePlaceOrder = async (e) => {
  //   e.preventDefault();

  //   // Validate form
  //   if (
  //     !form.email ||
  //     !form.name ||
  //     !form.phone ||
  //     !form.city ||
  //     !form.pincode ||
  //     !form.address
  //   ) {
  //     toast.error("Please fill in all required fields", {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSkipCartRedirect(true); // Prevent auto-redirect on empty cart

  //   try {
  //     const orderData = {
  //       items: cart,
  //       total: subTotal,
  //       customerInfo: form,
  //       orderId: "ORD" + Date.now(),
  //       orderDate: new Date().toISOString(),
  //       paymentMethod: form.paymentMethod,
  //     };

  //     // Save order (localStorage for now)
  //     localStorage.setItem("lastOrder", JSON.stringify(orderData));

  //     const orders = fetch("/api/placeOrder", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(orderData),
  //     });

  //     toast.success("Order placed successfully!", {
  //       position: "top-right",
  //       autoClose: 2000,
  //     });

  //     clearCart(); // Clear cart immediately
  //     router.push("/orders"); // Redirect immediately
  //   } catch (error) {
  //     toast.error("Failed to place order. Please try again.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate form fields
    const { email, name, phone, city, pincode, address, paymentMethod } = form;
    if (!email || !name || !phone || !city || !pincode || !address) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    setSkipCartRedirect(true); // Prevent auto-redirect if cart is empty

    try {
      // Convert cart array to object if needed
      const cartItems =
        Array.isArray(cart) &&
        cart.reduce((acc, item) => {
          acc[item.slug] = item;
          return acc;
        }, {});

      const orderData = {
        items: cartItems || cart, // works for array or object
        total: subTotal,
        customerInfo: {
          email: form.email,
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
        orderId: "ORD" + Date.now(),
        orderDate: new Date().toISOString(),
        paymentMethod,
      };

      // 🔹 Save order in localStorage (optional)
      localStorage.setItem("lastOrder", JSON.stringify(orderData));

      // 🔹 Send order to API
      const response = await fetch("/api/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      toast.success("Order placed successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      clearCart(); // Clear cart immediately
      router.push("/orders"); // Redirect after placing order
    } catch (error) {
      console.error("Place order error:", error);
      toast.error("Failed to place order. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiatePayment = async () => {
    const orderId = "ORD" + Date.now();
    try {
      const response = await fetch("/api/paytmTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: subTotal, custId: form.email }),
      });

      const data = await response.json();
      console.log("Paytm Transaction Response:", data);

      if (!data.body?.txnToken) {
        toast.error("Failed to initiate payment. Please try again.");
        return;
      }

      const txnToken = data.body.txnToken;

      // Load Paytm Checkout JS dynamically
      const script = document.createElement("script");
      script.src =
        "https://securestage.paytmpayments.com/merchantpgpui/checkoutjs/merchants/" +
        process.env.NEXT_PUBLIC_PAYTM_MID +
        ".js";
      script.onload = () => {
        window.Paytm.CheckoutJS.init({
          root: "",
          flow: "DEFAULT",
          data: {
            orderId: orderId,
            token: txnToken,
            tokenType: "TXN_TOKEN",
            amount: subTotal.toString(),
          },
          handler: {
            notifyMerchant: function (eventName, data) {
              console.log("Paytm Event:", eventName, data);
            },
          },
        }).then(() => {
          window.Paytm.CheckoutJS.invoke();
        });
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Paytm initiation error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const checkPaymentStatus = async (orderId) => {
    try {
      const res = await fetch("/api/postTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      console.log("Paytm Transaction Status:", data);
    } catch (error) {
      console.error("Error checking transaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
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

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Checkout
        </h1>

        <div className="lg:flex lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-lg p-8 mb-8 lg:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Shipping Information
            </h2>

            <form onSubmit={handlePlaceOrder}>
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+1 234 567 8901"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Your complete address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
                />
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    placeholder="12345"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-6">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Method *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-700"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI Payment</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                // onClick={initiatePayment}
                className="w-full bg-gray-800 text-white py-3 rounded-md text-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {Object.keys(cart).length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                Object.keys(cart).map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <div className="font-medium">{cart[item].name}</div>
                      <div className="text-sm text-gray-500">
                        {cart[item].variant} / {cart[item].size}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{cart[item].price}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {cart[item].qty}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>₹{subTotal}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>• Free shipping on orders above ₹499</p>
              <p>• 7-day return policy</p>
              <p>• Secure payment processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
