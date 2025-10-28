"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
export default function Home() {
  const images = [
    '/Mechanic.jpg',
    '/Automobile.jpg',
    '/Mechanic2.jpg',
    '/Mechanic3.jpg',
    '/Mechanic4.jpg', // Added missing slash
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Images with transition */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 -z-10" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Text */}
        <header className="pt-8 text-center space-y-14">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            BODE AUTOMOTIVES
          </h1>
          <p className="text-lg md:text-xl font-bold text-green-400 max-w-2xl mx-auto">
            WHERE PERFOMANCE MEETS PRECISION
          </p>
        </header>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

       {/* Bottom Button */}
       <div className="flex justify-center pb-8">
        
           <Link href="/Login">
        <button className="w-full bg-green-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition duration-300 transform hover:scale-105 shadow-lg">
         Get Started
        </button>
      </Link>
        </div>
      </div>
    </div>
  );
}