/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import mongoose from "mongoose";
import Product from "@/models/Product";

const Mugs = ({products}) => {

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-16 mx-auto">
        <div className="flex flex-wrap -m-4">
          {products.map((item) => (
            <Link
              href={`/product/${item.slug}`}
              key={item._id}
              className="lg:w-1/4 md:w-1/2 p-4 w-full"
            >
              <div className="block relative h-55 shadow-sm shadow-gray-400 rounded-2xl overflow-hidden">
                <img
                  alt={item.title}
                  className="object-cover object-top w-full h-full block"
                  src={item.image}
                />
              </div>
              <div className="mt-4 text-center md:text-left">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                  {item.category}
                </h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">
                  {item.title}
                </h2>
                <p className="mt-1 font-semibold text-green-600">
                  ₹{item.price}
                </p>

                {/* Colors */}
                {item.color && (
                  <div className="mt-2 flex flex-wrap gap-1 justify-center md:justify-start">
                    <span className="text-xs text-gray-500 mr-1">Colors:</span>
                    {Array.isArray(item.color) 
                      ? item.color.map((color) => (
                          <span
                            key={color}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          ></span>
                        ))
                      : <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color?.toLowerCase() }}
                          title={item.color}
                        ></span>
                    }
                  </div>
                )}

                {/* Sizes */}
                {item.size && (
                  <div className="mt-2 flex flex-wrap gap-1 justify-center md:justify-start">
                    <span className="text-xs text-gray-500 mr-1">Sizes:</span>
                    {Array.isArray(item.size) 
                      ? item.size.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-1 text-xs border rounded cursor-pointer hover:bg-gray-100"
                          >
                            {size}
                          </span>
                        ))
                      : <span className="px-2 py-1 text-xs border rounded cursor-pointer hover:bg-gray-100">
                          {item.size}
                        </span>
                    }
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const products = await Product.find({ category: "mug" });

  return {
    props: { products: JSON.parse(JSON.stringify(products)) },
  };
}
export default Mugs;
