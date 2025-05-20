import React from 'react';

const BestDevices = () => {
  return (
    <>
      {/* --- Best Phone Section --- */}
      <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-12 py-10 bg-gradient-to-r from-white via-blue-50 to-white">
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left mt-6 md:mt-0 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Future of Smartphones
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto md:mx-0">
            The best phone of 2024 — sleek, powerful, and built for next-gen photography and speed.
          </p>
          <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700 transition shadow">
            Explore
          </button>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src="/admin-ui/hero/hero-1.png"
            alt="Best Phone 2024"
            className="w-2/3 md:w-full max-w-md object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </section>

      {/* --- Best Laptop Section --- */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-10 bg-gradient-to-r from-white via-blue-50 to-white">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
          <img
            src="/admin-ui/hero/hero-2.png"
            alt="Best Laptop 2024"
            className="w-2/3 md:w-full max-w-md object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Best Laptop of 2024
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto md:mx-0">
            Power, portability, and performance — designed to supercharge your work and creativity.
          </p>
          <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700 transition shadow">
            Learn More
          </button>
        </div>
      </section>
    </>
  );
};

export default BestDevices;
