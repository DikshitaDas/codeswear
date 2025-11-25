import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          {/* Left Logo + Description */}
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <Link
              href="/"
              className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
            >
              <Image
                src="/Logo.png"
                alt="Codeswear Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <span className="ml-3 text-xl font-semibold">Codeswear</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Premium tech apparel and accessories designed for developers and
              creatives. Comfortable, stylish, and perfect for work or casual wear.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            {[1, 2, 3, 4].map((col) => (
              <div key={col} className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                  {col === 1
                    ? "Products"
                    : col === 2
                    ? "Company"
                    : col === 3
                    ? "Support"
                    : "Legal"}
                </h2>
                <nav className="list-none mb-10">
                  {col === 1 && (
                    <>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          T-Shirts
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Hoodies
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Mugs
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Stickers
                        </a>
                      </li>
                    </>
                  )}
                  {col === 2 && (
                    <>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          About Us
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Careers
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Blog
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Press
                        </a>
                      </li>
                    </>
                  )}
                  {col === 3 && (
                    <>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Contact Support
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Shipping & Returns
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Size Guide
                        </a>
                      </li>
                    </>
                  )}
                  {col === 4 && (
                    <>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Terms of Service
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Cookie Policy
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-600 hover:text-gray-800">
                          Accessibility
                        </a>
                      </li>
                    </>
                  )}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-100">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Codeswear —
              <a
                href="https://twitter.com/knyttneve"
                rel="noopener noreferrer"
                className="text-gray-600 ml-1"
                target="_blank"
              >
                @codeswear
              </a>
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
              {/* Example social icons */}
              <a className="text-gray-500">
                <svg
                  fill="currentColor"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500">
                <svg
                  fill="currentColor"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5A4.5 4.5 0 0023 3z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
