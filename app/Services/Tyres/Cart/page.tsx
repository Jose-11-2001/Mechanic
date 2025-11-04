"use client";

import Link from 'next/link';

export default function TyresCartPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/Services/Tyres" className="text-blue-400 hover:text-blue-300">
          &larr; Back to Tyres
        </Link>
        <h1 className="text-3xl font-bold my-6">Tyres Cart</h1>
        <p>Your tyres cart is empty.</p>
      </div>
    </div>
  );
}