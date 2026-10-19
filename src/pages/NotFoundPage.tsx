import React from 'react';
import { Link } from 'react-router-dom';
import { DropletOff, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-[#F5F9FB] to-white min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-8 sm:p-12 max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-[#087EBC] flex items-center justify-center mx-auto shadow-xs">
          <DropletOff className="w-8 h-8" />
        </div>
        <span className="text-4xl font-black text-[#103B54] font-mono block">
          404
        </span>
        <h1 className="text-xl font-bold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
          Page Not Found
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          The water stream you are following seems to have dried up or the address does not exist.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/10 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to AquaAlert Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
