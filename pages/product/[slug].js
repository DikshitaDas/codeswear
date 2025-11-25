/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { ToastContainer, toast } from "react-toastify";

const Post = ({ addToCart, buyNow, product, variants }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [pin, setPincode] = useState("");
  const [serviceable, setServiceable] = useState();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    // Initialize default color & size
    const defaultColor = Object.keys(variants)[0];
    setSelectedColor(defaultColor);
    setSelectedSize(Object.keys(variants[defaultColor])[0]);
  }, [variants]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const checkServiceability = async () => {
    const pincodes = await fetch("http://localhost:3000/api/pincodes");
    const data = await pincodes.json();
    if (data.includes(parseInt(pin))) {
      setServiceable(true);
    } else {
      setServiceable(false);
    }
  };

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="container px-5 py-16 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt={product.title}
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded shadow-2xl"
              src={product.image}
            />

            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {product.brand || "Brand Name"}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title}
              </h1>

              <p className="leading-relaxed">{product.description}</p>

              {/* Colors & Sizes */}
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                {/* Colors */}
                <div className="flex">
                  <span className="mr-3">Color</span>
                  {Object.keys(variants).map((color) => (
                    <button
                      key={color}
                      className={`border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none ${
                        color === selectedColor ? "ring-2 ring-gray-500" : ""
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(Object.keys(variants[color])[0]);
                      }}
                    ></button>
                  ))}
                </div>

                {/* Sizes */}
                <div className="flex ml-6 items-center">
                  <span className="mr-3">Size</span>
                  <div className="relative">
                    <select
                      className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 text-base pl-3 pr-10"
                      onChange={(e) => setSelectedSize(e.target.value)}
                      value={selectedSize}
                    >
                      {selectedColor &&
                        Object.keys(variants[selectedColor]).map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                    </select>
                    <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center gap-4">
                <span className="title-font font-medium text-2xl text-gray-900">
                  ₹{product.price}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (!selectedColor || !selectedSize) {
                        toast.error("Please select color and size", {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                          progress: undefined,
                          theme: "light",
                        });
                        return;
                      }
                      addToCart(
                        variants[selectedColor][selectedSize].slug,
                        1,
                        product.price,
                        product.title,
                        selectedSize,
                        selectedColor
                      );
                    }}
                    className="flex text-white bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-black rounded"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedColor || !selectedSize) {
                        toast.error("Please select color and size", {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                          progress: undefined,
                          theme: "light",
                        });
                        return;
                      }
                      buyNow(
                        variants[selectedColor][selectedSize].slug,
                        1,
                        product.price,
                        product.title,
                        selectedSize,
                        selectedColor
                      );
                      toast.success("Redirecting to checkout...", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                      });
                    }}
                    className="flex text-white bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-black rounded"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Pincode check */}
              <div className="mt-6">
                <p className="mt-2 text-xs text-gray-500">
                  Enter your pincode to check delivery options.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <button
                    onClick={checkServiceability}
                    className="text-white bg-gray-500 border-0 px-4 py-2 focus:outline-none hover:bg-black rounded"
                  >
                    Check
                  </button>
                </div>

                <div className="mt-4 h-6 flex items-center">
                  {serviceable && (
                    <span className="text-green-500">
                      Yay! We deliver to this pincode
                    </span>
                  )}
                  {serviceable === false && (
                    <span className="text-red-500">
                      Sorry! We do not deliver to this pincode
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  let product = await Product.findOne({ slug: context.query.slug });

  // Generate color-size slug mapping from arrays
  let colorSizeSlug = {};
  if (product.color && product.size) {
    for (let c of product.color) {
      colorSizeSlug[c] = {};
      for (let s of product.size) {
        colorSizeSlug[c][s] = { slug: product.slug }; // same slug for all variants (you can customize)
      }
    }
  } else {
    colorSizeSlug["default"] = { default: { slug: product.slug } };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(colorSizeSlug)),
    },
  };
}

export default Post;
