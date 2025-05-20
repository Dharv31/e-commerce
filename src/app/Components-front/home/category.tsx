"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

const categories = [
  {
    name: 'Laptop',
    image: '/admin-ui/categories/laptops-category.png',
    details: 'High-performance laptops for work & play.',
  },
  {
    name: 'Phone',
    image: '/admin-ui/categories/phones-category.png',
    details: 'Latest smartphones with cutting-edge tech.',
  },
  {
    name: 'Tv',
    image: '/admin-ui/categories/tv-home-category.png',
    details: 'Smart TVs with immersive viewing.',
  },
  {
    name: 'Accessories',
    image: '/admin-ui/categories/accessories-category.png',
    details: 'Essential add-ons for your devices.',
  },
  {
    name: 'Watches',
    image: '/admin-ui/categories/watches-category.png',
    details: 'Stylish and smart timepieces.',
  },
  {
    name: 'iPad',
    image: '/admin-ui/categories/ipads-category.png',
    details: 'Powerful tablets for productivity and fun.',
  },
]

const CategoryHome = () => {

    const router = useRouter()

  return (
    <div className="px-6 md:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="relative group h-56 md:h-64 lg:h-72 rounded-lg overflow-hidden shadow-lg cursor-pointer"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${cat.image})` }}
          ></div>

          {/* Static dark overlay */}
          <div className="absolute inset-0 bg-black  bg-opacity-30"></div>

          {/* Hover Slide-up Details */}
          <div className="absolute text-center  h-full bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out bg-black bg-opacity-100 text-white p-4">
            <h2 className="text-lg mt-20  font-semibold mb-1">{cat.name}</h2>
            <p className="text-sm mb-3">{cat.details}</p>
            <button onClick={()=>{router.push('/shop')}} className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-700 transition">
              Shop Now
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategoryHome
