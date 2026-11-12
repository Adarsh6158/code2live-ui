"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS, getProjectById, Project } from "@/data/projects";
import {
  ArrowLeft,
  RotateCw,
  ExternalLink,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

interface DemoClientProps {
  slug: string;
}

export function DemoClient({ slug }: DemoClientProps) {
  const project: Project = getProjectById(slug) || PROJECTS[0];

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t0 = setTimeout(() => setIsLoading(true), 10);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(t0);
      clearTimeout(timer);
    };
  }, [project.id, iframeKey]);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[768px]";
      case "desktop":
      default:
        return "max-w-full";
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F4EBE3] text-[#2E160C] overflow-hidden font-sans">
      <header className="shrink-0 h-14 bg-[#FAF4EF]/90 backdrop-blur-md border-b border-[#E2D4C8] px-3 sm:px-6 flex items-center justify-between gap-3 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] z-30">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-[#6E503F] hover:text-[#2E160C] hover:bg-[#EDE3DA] transition-colors focus-visible:outline-2 focus-visible:outline-[#2E6BFF]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Showcase</span>
            <span className="sm:hidden">Showcase</span>
          </Link>

          <div className="h-4 w-px bg-[#E2D4C8] hidden sm:block" />

          <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-[#2E160C] bg-[#EDE3DA] rounded-lg border border-[#E2D4C8]">
            <span>{project.name}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="flex items-center justify-between w-full px-3 py-1 bg-[#FAF4EF] rounded-lg border border-[#E2D4C8] text-xs font-mono text-[#2E160C] shadow-2xs">
            <div className="flex items-center gap-2 truncate">
              <span className="truncate text-[#2E160C] font-medium">{project.liveUrl}</span>
            </div>
            <span className="text-[10px] text-[#9B7D6E] shrink-0 ml-2 font-sans font-medium">HTTPS</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden md:flex items-center bg-[#EDE3DA] p-0.5 rounded-xl border border-[#E2D4C8]">
            <button
              onClick={() => setViewport("desktop")}
              title="Desktop View"
              aria-label="Desktop View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewport === "desktop" ? "bg-[#FAF4EF] text-[#2E160C] shadow-2xs font-medium" : "text-[#6E503F] hover:text-[#2E160C]"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              title="Tablet View"
              aria-label="Tablet View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewport === "tablet" ? "bg-[#FAF4EF] text-[#2E160C] shadow-2xs font-medium" : "text-[#6E503F] hover:text-[#2E160C]"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              title="Mobile View"
              aria-label="Mobile View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewport === "mobile" ? "bg-[#FAF4EF] text-[#2E160C] shadow-2xs font-medium" : "text-[#6E503F] hover:text-[#2E160C]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            title="Reload Application Frame"
            aria-label="Reload Application Frame"
            className="p-2 rounded-xl text-[#6E503F] hover:text-[#2E160C] hover:bg-[#EDE3DA] border border-transparent hover:border-[#E2D4C8] transition-colors focus-visible:outline-2 focus-visible:outline-[#2E6BFF] cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <a
            href={project.architectureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium text-[#6E503F] hover:text-[#2E160C] bg-[#FAF4EF] hover:bg-[#F4EBE3] border border-[#E2D4C8] hover:border-[#C4B1A0] shadow-2xs transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#2E6BFF]"
          >
            <Layers className="w-3.5 h-3.5 text-[#6E503F]" />
            <span>Architecture</span>
          </a>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-medium text-white bg-[#2E6BFF] hover:bg-[#2057DF] shadow-[0_2px_8px_rgba(46,107,255,0.25)] transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#2E6BFF]"
          >
            <span className="hidden sm:inline">Open Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <main className="flex-1 min-h-0 p-2 sm:p-4 md:p-6 flex items-center justify-center bg-[#F4EBE3] overflow-hidden">
        <div
          className={`relative h-full w-full ${getContainerWidth()} mx-auto transition-all duration-300 rounded-2xl overflow-hidden border border-[#E2D4C8] bg-[#FAF4EF] shadow-[0_8px_30px_rgba(46,22,12,0.06)] flex flex-col`}
        >
          <div className="h-8 bg-[#F3EBE3] border-b border-[#E2D4C8] px-3 flex items-center justify-between text-xs text-[#6E503F] shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/40" />
              <span className="text-[11px] font-sans font-medium text-[#6E503F] ml-2">{project.name} Environment</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#6E503F]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>TLS 1.3 Active</span>
            </div>
          </div>

          <div className="relative flex-1 w-full bg-[#FAF4EF] overflow-hidden">
            <iframe
              key={iframeKey}
              src={project.liveUrl}
              title={`${project.name} Interactive Application`}
              className="w-full h-full border-0 select-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {isLoading && (
              <div className="absolute inset-0 bg-[#FAF4EF]/90 backdrop-blur-xs flex flex-col items-center justify-center gap-4 z-20 px-4 text-center">
                <div className="relative flex items-center justify-center p-3.5 rounded-2xl bg-[#FAF4EF] border border-[#E2D4C8] shadow-[0_4px_16px_rgba(46,22,12,0.06)]">
                  <Image
                    src={project.id.includes("pay") ? "/Payment.svg" : "/AiAnim.svg"}
                    alt={`${project.name} Environment`}
                    width={96}
                    height={96}
                    className={`select-none ${
                      project.id.includes("pay")
                        ? "w-28 h-18 object-contain"
                        : "w-20 h-20 sm:w-24 sm:h-24 object-contain"
                    }`}
                  />
                </div>

                <div className="w-6 h-6 rounded-full border-2 border-[#E2D4C8] border-t-[#2E6BFF] animate-spin" />

                <div className="text-center space-y-1">
                  <p className="text-xs font-sans font-semibold text-[#2E160C]">
                    Connecting to {project.name}
                  </p>
                  <p className="text-[11px] font-sans text-[#6E503F]">
                    Initializing secure sandbox session...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="shrink-0 h-8 bg-[#FAF4EF] border-t border-[#E2D4C8] px-4 flex items-center justify-between text-[11px] font-sans text-[#6E503F] select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E6BFF]" />
          <span>Interactive Sandbox Session</span>
        </div>
        <div className="flex items-center gap-3 text-[#9B7D6E]">
          <span>Viewport: {viewport.toUpperCase()}</span>
          <span>•</span>
          <span>Security: Sandboxed</span>
        </div>
      </footer>
    </div>
  );
}
