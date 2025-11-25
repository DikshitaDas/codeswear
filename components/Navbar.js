import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiFillCloseCircle,
  AiOutlineShoppingCart,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({
  logout, // optional
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // detect admin + login state from JWT in localStorage
  useEffect(() => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setIsAdmin(false);
        setIsLoggedIn(false);
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      setIsAdmin(payload?.user?.role === "admin");
      setIsLoggedIn(true);
    } catch {
      setIsAdmin(false);
      setIsLoggedIn(false);
    }
  }, [router.pathname]);

  // Close cart and dropdowns automatically on any route change
  useEffect(() => {
    const handleRoute = () => {
      setCartOpen(false);
      setUserDropdownOpen(false);
      setIsOpen(false);
    };
    router.events.on("routeChangeStart", handleRoute);
    router.events.on("hashChangeStart", handleRoute);
    return () => {
      router.events.off("routeChangeStart", handleRoute);
      router.events.off("hashChangeStart", handleRoute);
    };
  }, [router.events]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest(".user-dropdown")) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  const isActive = (path) => router.pathname === path;
  const desktopLinkBase =
    "relative px-3 py-2 rounded-lg transition font-medium";
  const desktopLinkClass = (path) =>
    `${desktopLinkBase} ${
      isActive(path)
        ? "bg-gray-900 text-white shadow-sm"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`;

  const handleLogout = () => {
    try {
      if (typeof logout === "function") {
        logout();
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user_email");
    } catch {}
    setUserDropdownOpen(false);
    setIsOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white/90 backdrop-blur shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Codeswear Logo" width={75} height={40} />
          <span className="text-lg sm:text-xl font-bold text-gray-800">
            Codeswear
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-2 text-gray-700 font-medium mx-auto">
          <li>
            <Link href="/" className={desktopLinkClass("/")}>
              <span className="relative inline-block">
                Home
                {isActive("/") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80"></span>
                )}
              </span>
            </Link>
          </li>
          <li>
            <Link href="/tshirt" className={desktopLinkClass("/tshirt")}>
              <span className="relative inline-block">
                Tshirts
                {isActive("/tshirt") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80"></span>
                )}
              </span>
            </Link>
          </li>
          <li>
            <Link href="/hoodies" className={desktopLinkClass("/hoodies")}>
              <span className="relative inline-block">
                Hoodies
                {isActive("/hoodies") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80"></span>
                )}
              </span>
            </Link>
          </li>
          <li>
            <Link href="/mugs" className={desktopLinkClass("/mugs")}>
              <span className="relative inline-block">
                Mugs
                {isActive("/mugs") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80"></span>
                )}
              </span>
            </Link>
          </li>
          <li>
            <Link href="/stickers" className={desktopLinkClass("/stickers")}>
              <span className="relative inline-block">
                Stickers
                {isActive("/stickers") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80"></span>
                )}
              </span>
            </Link>
          </li>
          <li>
            <Link href="/about" className={desktopLinkClass("/about")}>
              <span className="relative inline-block">
                About Us
                {isActive("/about") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80"></span>
                )}
              </span>
            </Link>
          </li>
          <li>
            <Link href="/contact" className={desktopLinkClass("/contact")}>
              <span className="relative inline-block">
                Contact
                {isActive("/contact") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/80"></span>
                )}
              </span>
            </Link>
          </li>
        </ul>

        {/* Buttons (right) */}
        <div className="hidden md:flex gap-3 items-center">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 shadow-sm ring-1 ring-black/5 transition text-sm font-semibold"
              title="Admin Dashboard"
            >
              <span>🛡️</span>
              <span>Dashboard</span>
            </Link>
          )}

          {isLoggedIn && (
            <button
              className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-800 transition relative"
              title="View Cart"
              onClick={() => setCartOpen(true)}
            >
              <AiOutlineShoppingCart size={20} />
              {Object.keys(cart).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {Object.keys(cart).length}
                </span>
              )}
            </button>
          )}

          {/* User Authentication */}
          {isLoggedIn ? (
            <div className="relative user-dropdown">
              <button
                className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                title="Account"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <MdAccountCircle size={20} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/myorders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button
                className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-800 transition"
                title="Login"
              >
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-4">
            {/* Navigation Links */}
            <ul className="flex flex-col gap-2 text-gray-700 font-medium mb-6">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    isActive("/")
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tshirt"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    isActive("/tshirt")
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Tshirts
                </Link>
              </li>
              <li>
                <Link
                  href="/hoodies"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    isActive("/hoodies")
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/mugs"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    isActive("/mugs")
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Mugs
                </Link>
              </li>
              <li>
                <Link
                  href="/stickers"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    isActive("/stickers")
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Stickers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    isActive("/about")
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition ${
                    isActive("/contact")
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* User Actions */}
            <div className="border-t border-gray-200 pt-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition mb-3"
                >
                  <span>🛡️</span>
                  <span>Admin</span>
                </Link>
              )}

              {/* Cart Button */}
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition mb-3"
                onClick={() => {
                  setCartOpen(true);
                  setIsOpen(false);
                }}
              >
                <AiOutlineShoppingCart size={20} />
                <span>View Cart</span>
                {Object.keys(cart).length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {Object.keys(cart).length}
                  </span>
                )}
              </button>

              {/* User Authentication */}
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Link href="/profile" className="flex-1">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm"
                      >
                        Profile
                      </button>
                    </Link>
                    <Link href="/myorders" className="flex-1">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm"
                      >
                        Orders
                      </button>
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <button
                    className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <MdAccountCircle size={20} />
                    <span>Login / Sign Up</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Cart */}
      {cartOpen && (
        <div className="fixed inset-0 flex justify-end z-[999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-700 opacity-50"
            onClick={() => setCartOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative w-96 max-w-full bg-white h-full shadow-2xl transform transition-transform duration-300 translate-x-0">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <AiFillCloseCircle size={26} />
            </button>

            <div className="p-6 flex flex-col h-full">
              <h2 className="font-bold text-2xl mb-1">Shopping Cart</h2>
              <p className="text-sm text-gray-500 mb-4">
                Review items in your bag
              </p>

              <ul className="space-y-3 flex-1 overflow-auto pr-1">
                {Object.keys(cart).length === 0 && (
                  <div className="text-center text-gray-500">
                    Your cart is empty
                  </div>
                )}

                {Object.keys(cart).map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">
                        {cart[item].name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cart[item].variant} • {cart[item].size}
                      </div>
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <AiOutlineMinusCircle
                        onClick={() => removeFromCart(item, 1)}
                        className={`cursor-pointer text-lg bg-white rounded-full p-[2px] hover:bg-black hover:text-white transition ${
                          cart[item].qty === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      />

                      <span className="w-6 text-center font-medium">
                        {cart[item].qty}
                      </span>

                      <AiOutlinePlusCircle
                        onClick={() =>
                          addToCart(
                            item,
                            1,
                            cart[item].price,
                            cart[item].name,
                            cart[item].size,
                            cart[item].variant
                          )
                        }
                        className="cursor-pointer text-lg text-black bg-white rounded-full p-[2px] hover:bg-black hover:text-white transition"
                      />
                      <div className="ml-3 text-right min-w-[64px] font-semibold text-gray-900">
                        ₹{cart[item].price * cart[item].qty}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-gray-200 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{subTotal}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Clear
                  </button>
                  <Link href={"/Checkout"} className="flex-1">
                    <button
                      onClick={() => setCartOpen(false)}
                      className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                    >
                      Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
