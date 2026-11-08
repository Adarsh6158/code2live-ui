"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { CodeToLivePreview, AppType } from "./CodeToLivePreview";
import { ArrowUpRight, ArrowRight, Layers, Play } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  initialApp?: AppType;
}

export function ProjectCard({ project, initialApp = "bitecraft" }: ProjectCardProps) {
  const [currentApp, setCurrentApp] = useState<AppType>(initialApp);
  const [isReplaying, setIsReplaying] = useState(false);

  const handleReplay = useCallback(() => {
    setIsReplaying(true);
  }, []);

  const handleReplayComplete = useCallback(() => {
    setIsReplaying(false);
  }, []);

  const activeSlug = currentApp === "bitecraft" ? "food" : "kanban";
  const frameUrl = `https://code2live.adarshcodes.com/${activeSlug}`;
  const frameTitle = `AI-Powered Application Builder — Code2Live Live Preview (${currentApp === "bitecraft" ? "BiteCraft Food Delivery" : "FlowBoard Kanban"})`;

  return (
    <article
      aria-label="Code2Live AI Application Platform"
      className="group flex flex-col bg-white rounded-3xl border border-[#e5e5e5] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#d4d4d8] hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 p-3.5 sm:p-5"
    >
      <div className="pb-1 max-w-3xl">
        <p className="text-xs sm:text-[13px] text-[#737373] leading-relaxed">
          Describe what you want to build. Watch AI transform your ideas into functional applications.
        </p>
      </div>

      <div className="my-2 sm:my-2.5">
        <BrowserFrame
          url={frameUrl}
          title={frameTitle}
          onReplay={handleReplay}
          isReplaying={isReplaying}
          externalLink={`/${activeSlug}`}
        >
          <CodeToLivePreview
            isReplaying={isReplaying}
            onReplayComplete={handleReplayComplete}
            initialApp={initialApp}
            onAppChange={setCurrentApp}
          />
        </BrowserFrame>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-2.5 sm:pt-3 border-t border-[#e5e5e5]">
        <a
          href={project.architectureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="order-2 sm:order-1 group/btn inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-5 sm:px-7 rounded-xl border border-[#e5e5e5] bg-white hover:bg-[#fafafa] hover:border-[#d4d4d8] text-[#737373] hover:text-[#171717] text-xs sm:text-sm font-medium shadow-2xs transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#171717] w-full sm:w-auto cursor-pointer"
        >
          <Layers className="w-4 h-4 text-[#737373] group-hover/btn:text-[#171717] transition-colors" />
          <span>Explore Architecture</span>
          <ArrowUpRight className="w-4 h-4 text-[#a3a3a3] group-hover/btn:text-[#171717] transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>

        <Link
          href="/demo/code-to-live"
          className="order-1 sm:order-2 group/btn inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-6 sm:px-8 rounded-xl bg-[#171717] hover:bg-[#303030] active:bg-[#404040] text-white text-xs sm:text-sm font-medium shadow-2xs transition-colors duration-150 ease-in-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#171717] w-full sm:w-auto cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current text-white" />
          <span>Try Demo</span>
          <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
