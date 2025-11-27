"use client";
import { Suspense } from 'react';
import BookContent from './BookContent';

export default function Book() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookContent />
    </Suspense>
  );
}