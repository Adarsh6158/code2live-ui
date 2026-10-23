"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90"
        >
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200/80 bg-white shadow-xs shrink-0 flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="Adarsh Kumar Brand Mark"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0">
            <span className="font-semibold text-slate-900 tracking-tight shrink-0">
              Adarsh Kumar
            </span>
            <span className="text-slate-300 font-light select-none">/</span>
            <span className="font-medium text-slate-600 truncate">
              Code2Live
            </span>
          </div>
        </Link>

        {/* Center: Tagline with subtle light color */}
        <div className="hidden lg:flex items-center text-xs font-normal text-slate-500 tracking-tight select-none">
          Explore the architecture, then experience the application live.
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href="https://adarshcodes.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Main Portfolio"
            aria-label="Main Portfolio"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white shadow-2xs focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <span className="hidden sm:inline">Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="https://github.com/Adarsh6158/AI-Code-Generation-Platform"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            aria-label="GitHub Repository"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50 shadow-2xs focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Image
              src="/Github.svg"
              alt="GitHub"
              width={14}
              height={14}
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="hidden sm:inline">GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
