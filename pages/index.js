/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product";

export async function getServerSideProps() {
  try {
    if (!mongoose.connections[0]?.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(12);
    return { props: { products: JSON.parse(JSON.stringify(products)) } };
  } catch (e) {
    return { props: { products: [] } };
  }
}

const Home = ({ products }) => {
  const categories = [
    { href: "/tshirt", label: "T-Shirts", image: "/tshirt.jpg" },
    { href: "/hoodies", label: "Hoodies", image: "/hoodie.jpg" },
    { href: "/mugs", label: "Mugs", image: "/mug.jpg" },
    { href: "/stickers", label: "Stickers", image: "/sticker.jpg" },
  ];

  const productList = Array.isArray(products) ? products : [];
  const featured = productList.slice(0, 12);

  const trackRef = useRef(null);
  const scrollByCards = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".fp-card");
    const amount = card ? card.offsetWidth + 16 /* gap */ : 300;
    el.scrollBy({ left: dir * amount * 2, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* gradient base */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900" />
        {/* background image with low opacity */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home3.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Wear the Code. Shop your next favorite apparel.
            </h1>
            <p className="mt-4 text-gray-200/90 md:text-lg">
              Premium tees, cozy hoodies, and more — crafted for developers.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/tshirt"
                className="px-5 py-3 rounded-lg bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              >
                Shop T-Shirts
              </Link>
              <Link
                href="/hoodies"
                className="px-5 py-3 rounded-lg bg-white/10 backdrop-blur text-white hover:bg-white/20 ring-1 ring-white/30"
              >
                Shop Hoodies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Shop by category
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group block rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow transition"
            >
              {/* Fixed height, full width, object-cover to fill container */}
              <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
                <img
                  src={c.image}
                  alt={c.label}
                  className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="font-medium text-gray-800">{c.label}</div>
                <div className="text-xs text-gray-500">
                  Explore {c.label.toLowerCase()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED - Carousel */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Featured products
          </h2>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous"
              onClick={() => scrollByCards(-1)}
              className="h-9 w-9 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={() => scrollByCards(1)}
              className="h-9 w-9 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              ›
            </button>
            <Link
              href="/tshirt"
              className="text-sm text-gray-700 hover:text-gray-900 ml-2"
            >
              View all
            </Link>
          </div>
        </div>
        {featured.length === 0 ? (
          <div className="text-gray-600">No products available.</div>
        ) : (
          <div className="relative">
            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {featured.map((p, idx) => (
                <div
                  key={p._id || idx}
                  className="fp-card snap-start shrink-0 w-64 group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow transition flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                    />
                    {idx < 3 && (
                      <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        New
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[11px] text-gray-500 uppercase">
                      {p.category}
                    </div>
                    <div className="font-medium text-gray-900 line-clamp-2 mt-1">
                      {p.title}
                    </div>
                    <div className="mt-2 text-green-600 font-semibold">
                      ₹{p.price}
                    </div>

                    {/* Color indicators */}
                    {Array.isArray(p.color) && p.color.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1 items-center">
                        {p.color.slice(0, 5).map((col) => (
                          <span
                            key={col}
                            title={col}
                            className="h-3 w-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: col.toLowerCase() }}
                          />
                        ))}
                        {p.color.length > 5 && (
                          <span className="text-xs text-gray-500">
                            +{p.color.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Buttons at bottom */}
                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/product/${p.slug}`}
                        className="flex-1 text-center px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-xs"
                      >
                        View
                      </Link>
                      <Link
                        href={`/${p.category}`}
                        className="flex-1 text-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs"
                      >
                        Similar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Stay in the loop
            </h3>
            <p className="text-sm text-gray-600">
              Get updates on new drops, discounts and more.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
