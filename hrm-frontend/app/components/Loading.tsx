// components/Loading.tsx
"use client";

import React from "react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg"; // Small, Medium, Large
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

const Loading: React.FC<LoadingProps> = ({ message = "Loading...", size = "md" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Spinner */}
      <div className={`border-4 border-t-indigo-500 border-gray-200 rounded-full animate-spin ${sizeClasses[size]}`} />
      
      {/* Message */}
      <p className="mt-3 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loading;