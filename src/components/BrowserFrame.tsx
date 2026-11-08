"use client";

import React, { ReactNode } from "react";
import { Lock, RotateCw, ExternalLink } from "lucide-react";

interface BrowserFrameProps {
  url: string;
  title?: string;
  onReplay?: () => void;
  isReplaying?: boolean;
  children: ReactNode;
  externalLink?: string;
  className?: string;
}

export function BrowserFrame({
  url,
  title,
  onReplay,
  isReplaying = false,
  children,
  externalLink,
  className = "",
}: BrowserFrameProps) {
  React.useEffect(() => {
    if (!onReplay) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;
      if (e.key === "r" || e.key === "R") {
        if (!isReplaying) onReplay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReplay, isReplaying]);

  return (
    <div
      aria-label={title || "Browser Preview"}
      className={`group/browser relative flex flex-col w-full rounded-2xl overflow-hidden bg-white border border-[#e5e5e5] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 ${className}`}
    >
      <div className="h-9 bg-[#fafafa] border-b border-[#e5e5e5] px-3 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-3 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/40 inline-block" />
        </div>

        <div className="flex items-center justify-center flex-1 max-w-lg mx-auto min-w-0 px-1">
          <div className="flex items-center justify-center gap-1.5 w-full py-0.5 px-2.5 sm:px-3 bg-white rounded-lg border border-[#e5e5e5] text-[#171717] shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_1px_2px_rgba(0,0,0,0.02)] text-[10px] sm:text-[11px] font-mono font-medium truncate">
            <Lock className="w-3 h-3 text-[#737373] shrink-0" />
            <span className="truncate text-[#171717]">{url}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              disabled={isReplaying}
              title="Replay simulation walkthrough (Press R)"
              aria-label="Replay simulation walkthrough (Press R)"
              className="inline-flex items-center gap-1 p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#f0f0f0] transition-colors focus-visible:outline-2 focus-visible:outline-[#171717] disabled:opacity-40 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReplaying ? "animate-spin text-[#171717]" : ""}`} />
              <kbd className="hidden sm:inline text-[9px] font-sans font-medium text-[#737373] bg-white border border-[#e5e5e5] px-1 py-0.2 rounded shadow-2xs leading-none">
                R
              </kbd>
            </button>
          )}

          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Open live deployment in new tab"
              aria-label="Open live deployment in new tab"
              className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#f0f0f0] transition-colors focus-visible:outline-2 focus-visible:outline-[#171717]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="relative w-full bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}
