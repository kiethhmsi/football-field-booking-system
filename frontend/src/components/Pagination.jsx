import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 py-8">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-gray-100 bg-white cursor-pointer ${
          currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft size={20} />
      </button>
      
      {pages.map(page => (
        <button 
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border-none cursor-pointer ${
            currentPage === page 
            ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-200' 
            : 'text-gray-500 hover:bg-gray-100 bg-white shadow-sm border border-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-gray-100 bg-white cursor-pointer ${
          currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-100'
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
