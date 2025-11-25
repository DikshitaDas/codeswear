import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (err) {
      console.log(err);
      localStorage.clear();
    }
  }, []);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subT = 0;
    for (let i in myCart) {
      subT += myCart[i].price * myCart[i].qty;
    }
    setSubTotal(subT);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = { ...cart }; // clone cart

    if (itemCode in newCart) {
      newCart[itemCode].qty += qty; // increase quantity
    } else {
      newCart[itemCode] = { qty, price, name, size, variant };
    }

    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (itemCode, qty) => {
    let newCart = { ...cart };

    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;

      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }

    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  return (
    <>
      <Navbar
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
      <Component
        {...pageProps}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        cart={cart}
        subTotal={subTotal}
      />
      ;
      <Footer
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
    </>
  );
}
