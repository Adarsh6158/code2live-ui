"use client";

import React from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { PROJECTS } from "@/data/projects";
import { Layers } from "lucide-react";

const TECH_STACK_ITEMS: { name: string; icon: string }[] = [
  { name: "Spring Boot", icon: "/icons/SpringBoot.png" },
  { name: "Spring AI", icon: "/icons/AI.svg" },
  { name: "Apache Kafka", icon: "/icons/Kafka.png" },
  { name: "Redis", icon: "/icons/Redis.svg" },
  { name: "Kubernetes", icon: "/icons/Kubernetes.svg" },
  { name: "React 19", icon: "/icons/React.svg" },
  { name: "TypeScript", icon: "/icons/Typescript.svg" },
];

export default function Home({
  initialApp = "bitecraft",
}: {
  initialApp?: "bitecraft" | "flowboard";
} = {}) {
  const project = PROJECTS[0];

  return (
    <div className="relative min-h-screen bg-[#F4EBE3] text-[#2E160C] font-sans antialiased selection:bg-[#2E6BFF] selection:text-white flex flex-col justify-between overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.85)_0%,rgba(244,235,227,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#2E160C14_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_50%,transparent_100%)]" />
      </div>

      <Header />

      <main className="flex-1 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-5 flex flex-col gap-3">
        <section aria-label="Featured Project" className="w-full">
          <ProjectCard project={project} initialApp={initialApp} />
        </section>

        <section
          aria-label="Technology Stack"
          className="w-full px-3.5 sm:px-4 py-2.5 rounded-2xl bg-[#FAF4EF] border border-[#E2D4C8] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_8px_rgba(46,22,12,0.03)] flex items-center"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#2E160C] bg-[#EDE3DA] border border-[#E2D4C8] shrink-0 select-none">
              <Layers className="w-3.5 h-3.5 text-[#2E6BFF]" />
              <span>Stack</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {TECH_STACK_ITEMS.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF4EF] border border-[#E2D4C8] hover:border-[#C4B1A0] text-xs font-medium text-[#2E160C] shadow-2xs hover:bg-[#F3EBE3] transition-all duration-150 select-none cursor-default"
                >
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={14}
                    height={14}
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
