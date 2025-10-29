"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
export default function Home() {
  const images = [
    '/Mechanic.jpg',
    '/Automobile.jpg',
    '/Mechanic2.jpg',
    '/Mechanic3.jpg',
    '/Mechanic4.jpg',
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
            WHERE PERFORMANCE MEETS PRECISION
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

        {/* Footer */}
        <footer className="bg-black bg-opacity-70 py-4">
          <div className="container mx-auto">
            <div className="flex justify-center space-x-8">
              {/* About Us Link */}
            <div className="flex justify-center mb-4">
              <Link 
                href="/AboutUs" 
                className="text-white hover:text-green-400 transition duration-300 font-semibold text-lg border-b-2 border-transparent hover:border-green-400 pb-1"
              >
                About Us
              </Link>
            </div>
              {/* Facebook */}
              <a 
                href="https://Josephmbukwa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500 transition duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://Jose" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-pink-500 transition duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://jose.11.2001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-pink-600 transition duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.815 3.73 13.664 3.73 12.367s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297zm8.062-10.615c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm1.396 10.615c-1.297 0-2.448-.49-3.323-1.297-.906-.875-1.396-2.026-1.396-3.323s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/0886663959" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-green-500 transition duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </a>

              {/* Telegram */}
              <a 
                href="https://t.me/Ras 2001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.191c-.167.752-.839 2.699-1.696 5.523-.99 3.256-1.389 3.796-2.034 3.77-.523-.021-1.219-.324-1.828-.592-1.215-.537-1.9-.873-3.064-1.4-1.344-.6-.473-1.119.293-1.767.201-.171 3.654-3.352 3.727-3.637.008-.034.015-.156-.058-.22-.073-.065-.18-.043-.258-.025-.11.025-1.844 1.17-5.203 3.438-.492.341-.938.508-1.338.5-.439-.009-1.283-.248-1.91-.453-.771-.253-1.384-.386-1.33-.815.028-.221.335-.447.92-.68 3.6-1.546 6.005-2.57 7.213-3.074 3.432-1.42 4.145-1.668 4.609-1.671.1-.001.322.023.466.14.118.095.151.223.166.312.015.09.033.297.018.458z"/>
                </svg>
              </a>
            </div>
            
            {/* Copyright text */}
            <div className="text-center mt-4">
              <p className="text-white text-sm">
                © {new Date().getFullYear()} BODE AUTOMOTIVES. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}