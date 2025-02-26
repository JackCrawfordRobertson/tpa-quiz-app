"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // Correct way to import images in Next.js
import { Github, BarChart, Code } from "lucide-react"; // Importing icons

export default function Footer() {
  return (
    <footer className="bg-muted text-black py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Image 
            src="/PA Logo Black.svg" 
            alt="Report Insights Logo" 
            width={32} // Adjust the width as needed
            height={32} // Adjust the height as needed
            className="w-40 h-20"
            priority
          />
          <span className="text-lg font-semibold">The Payments Quiz</span>
        </div>

        {/* Links Section */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
          
          <Link 
            href="https://github.com/JackCrawfordRobertson/tpa_quiz-app" 
            target="_blank" 
            className="hover:underline flex items-center space-x-2 text-gray-400 hover:text-white">
            <Github size={18} />
            <span>Frontend GitHub</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}