"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Header() {
  const portfolioUrl = "https://adarshcodes.com";
  const githubUrl = "https://github.com/Adarsh6158/AI-Code-Generation-Platform";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#e5e5e5] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-13 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center text-sm sm:text-base md:text-lg lg:text-[19px] font-bold text-[#171717] tracking-tight hover:opacity-90 transition-opacity truncate shrink-0"
        >
          <span>Turn your ideas into&nbsp;</span>
          <span className="text-blue-600">real applications.</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Portfolio"
            aria-label="Portfolio"
            className="group inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-[#737373] hover:text-[#171717] bg-white border border-[#e5e5e5] hover:border-[#d4d4d8] shadow-2xs transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            <span className="hidden sm:inline">Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#a3a3a3] group-hover:text-[#171717] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            aria-label="GitHub Repository"
            className="group inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-[#171717] bg-white hover:bg-[#fafafa] border border-[#e5e5e5] hover:border-[#d4d4d8] shadow-2xs transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#171717]"
          >
            <Image
              src="/Github.svg"
              alt="GitHub"
              width={14}
              height={14}
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="hidden sm:inline">GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#a3a3a3] group-hover:text-[#171717] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
