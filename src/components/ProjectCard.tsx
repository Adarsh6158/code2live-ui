"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { CodeToLivePreview } from "./CodeToLivePreview";
import { ArrowUpRight, ArrowRight, Layers, Play } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isReplaying, setIsReplaying] = useState(false);

  const handleReplay = () => {
    setIsReplaying(true);
  };

  const handleReplayComplete = () => {
    setIsReplaying(false);
  };

  return (
    <article
      aria-labelledby={`project-title-${project.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.02)] hover:border-slate-300 hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] transition-all duration-300 p-4 sm:p-5"
    >
      <div className="flex flex-col gap-1.5 sm:gap-2">

        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h2
            id={`project-title-${project.id}`}
            className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors"
          >
            Code2Live
          </h2>
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            AI-Driven Code Generation SaaS Platform
          </span>
        </div>
      </div>

      <div className="my-2.5 sm:my-3">
        <BrowserFrame
          url={project.liveUrl}
          title={project.name}
          onReplay={handleReplay}
          isReplaying={isReplaying}
          externalLink="/demo/code-to-live"
        >
          <CodeToLivePreview
            isReplaying={isReplaying}
            onReplayComplete={handleReplayComplete}
          />
        </BrowserFrame>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-100">
        <a
          href={project.architectureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="order-2 sm:order-1 group/btn inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 sm:px-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 text-sm sm:text-[15px] font-semibold shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-blue-600 w-full sm:w-auto"
        >
          <Layers className="w-4 h-4 text-slate-500 group-hover/btn:text-blue-600 transition-colors" />
          <span>View Architecture</span>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/btn:text-slate-700 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>

        <Link
          href="/demo/code-to-live"
          className="order-1 sm:order-2 group/btn inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 sm:px-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-[15px] font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.28)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.40)] transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-blue-600 w-full sm:w-auto"
        >
          <Play className="w-4 h-4 fill-current text-white/95 group-hover/btn:text-white" />
          <span>Try Live Demo</span>
          <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
