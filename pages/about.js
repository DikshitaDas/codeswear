import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
              About 
              <span className="text-gray-700"> Codeswear</span>
            </h1>
            <p className="mb-8 leading-relaxed text-gray-600 text-lg">
              At Codeswear, we blend creativity with comfort — designing apparel
              that lets you express your passion for coding and tech in style.
              From minimal designs to bold statements, wear what defines you,
              wherever you go.
            </p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-gray-700 border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 rounded text-lg">
                Shop Now
              </button>
              <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <Image
              className="object-cover object-center rounded-lg shadow-2xl"
              alt="Codeswear Team"
              src="/home3.jpg"
              width={500}
              height={400}
              priority
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="text-gray-600 body-font bg-white">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-800">
              Our Mission
            </h2>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-gray-600">
              We believe that what you wear should reflect who you are and what you love.
            </p>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-800 mb-4">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-800 font-medium title-font mb-2">
                  Premium Quality
                </h2>
                <p className="leading-relaxed text-gray-600 text-base">
                  Our products are made with high-quality materials that are
                  comfortable, durable, and perfect for everyday wear.
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-800 mb-4">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-800 font-medium title-font mb-2">
                  Unique Designs
                </h2>
                <p className="leading-relaxed text-gray-600 text-base">
                  Each design is carefully crafted to represent the coding community
                  and tech culture with style and authenticity.
                </p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-800 mb-4">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-800 font-medium title-font mb-2">
                  Community First
                </h2>
                <p className="leading-relaxed text-gray-600 text-base">
                  We are built by developers, for developers. Every product is designed
                  with the coding community in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="text-gray-600 body-font bg-gray-50">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col">
            <div className="h-1 bg-gray-200 rounded overflow-hidden">
              <div className="w-24 h-full bg-gray-700"></div>
            </div>
            <div className="flex flex-wrap sm:flex-row flex-col py-6 mb-12">
              <h1 className="sm:w-2/5 text-gray-800 font-medium title-font text-2xl mb-2 sm:mb-0">
                Our Story
              </h1>
              <p className="sm:w-3/5 leading-relaxed text-gray-600 sm:pl-10 pl-0">
                Founded by a team of passionate developers who wanted to create
                clothing that truly represents the coding lifestyle. We started
                small but with big dreams — to make every developer feel proud
                of their craft through what they wear.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
            <div className="p-4 md:w-1/3 sm:mb-0 mb-6">
              <div className="h-full text-center">
                <Image
                  alt="content"
                  className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200"
                  src="https://images.unsplash.com/photo-1759137538239-60e0b1e796fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={80}
                  height={80}
                />
                <h2 className="text-xl font-medium title-font text-gray-800 mb-4">
                  2023
                </h2>
                <p className="leading-relaxed text-gray-600">
                  Founded with a vision to create developer-focused apparel
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 sm:mb-0 mb-6">
              <div className="h-full text-center">
                <Image
                  alt="content"
                  className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200"
                  src="https://images.unsplash.com/photo-1759137538239-60e0b1e796fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={80}
                  height={80}
                />
                <h2 className="text-xl font-medium title-font text-gray-800 mb-4">
                  2024
                </h2>
                <p className="leading-relaxed text-gray-600">
                  Expanded our collection and built a strong developer community
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 sm:mb-0 mb-6">
              <div className="h-full text-center">
                <Image
                  alt="content"
                  className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200"
                  src="https://images.unsplash.com/photo-1759137538239-60e0b1e796fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={80}
                  height={80}
                />
                <h2 className="text-xl font-medium title-font text-gray-800 mb-4">
                  Future
                </h2>
                <p className="leading-relaxed text-gray-600">
                  Continuing to innovate and serve the global coding community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-gray-600 body-font bg-white">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
            <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-800">
              Ready to join the Codeswear community?
            </h1>
            <button className="flex-shrink-0 text-white bg-gray-700 border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 rounded text-lg mt-10 sm:mt-0">
              Shop Collection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;