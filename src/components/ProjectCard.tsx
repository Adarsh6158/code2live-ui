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
    <div className="flex flex-col items-center w-full">
      <article
        aria-label="Code2Live AI Application Platform"
        className="w-full group flex flex-col bg-[#FAF4EF] rounded-3xl border border-[#E2D4C8] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_8px_rgba(46,22,12,0.03)] p-3.5 sm:p-5"
      >
        <div className="pb-2 max-w-3xl">
          <p className="text-xs sm:text-[13px] text-[#6E503F] leading-relaxed">
            Describe what you want to build. Watch AI transform your ideas into functional applications.
          </p>
        </div>

        <div className="w-full relative">
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
      </article>

      <div className="flex items-center justify-center pt-4 sm:pt-5">
        <div className="inline-flex items-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#FAF4EF]/95 backdrop-blur-md border border-[#E2D4C8] shadow-[0_8px_30px_rgba(46,22,12,0.08)] select-none">
          <a
            href={project.architectureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center justify-center gap-2 h-9 sm:h-10 px-4 sm:px-6 rounded-xl border border-[#E2D4C8] bg-[#FAF4EF] hover:bg-[#EDE3DA] hover:border-[#C4B1A0] text-[#6E503F] hover:text-[#2E160C] text-xs sm:text-sm font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#6E503F] group-hover/btn:text-[#2E160C] transition-colors" />
            <span>Explore Architecture</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9B7D6E] group-hover/btn:text-[#2E160C] transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>

          <Link
            href="/demo/code-to-live"
            className="group/btn inline-flex items-center justify-center gap-2 h-9 sm:h-10 px-5 sm:px-7 rounded-xl bg-[#2E6BFF] hover:bg-[#2057DF] active:bg-[#1A4BCC] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(46,107,255,0.32)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-white" />
            <span>Try Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
