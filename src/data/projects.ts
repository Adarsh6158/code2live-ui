export interface Project {
  id: string;
  aliases: string[];
  name: string;
  category: string;
  tagline: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  architectureUrl: string;
  technologies: string[];
  highlights: string[];
  accentColor: "blue" | "emerald";
}

export const PROJECTS: Project[] = [
  {
    id: "code-to-live",
    aliases: ["codetolive", "code2live", "lovable"],
    name: "Code2Live",
    category: "AI Developer Platform",
    tagline: "AI-Driven Code Generation SaaS Platform",
    description:
      "Production-grade AI app generation engine that converts natural language requirements into full-stack web applications with real-time multi-file code streaming, live sandboxes, and automated deployments.",
    liveUrl: "https://code2live.adarshcodes.com",
    githubUrl: "https://github.com/Adarsh6158/AI-Code-Generation-Platform",
    architectureUrl: "https://adarshcodes.com/#project=lovable",
    technologies: [
      "Spring Boot",
      "Spring AI",
      "Apache Kafka",
      "Redis",
      "Kubernetes",
      "React 19",
      "TypeScript",
    ],
    highlights: [
      "Natural language to multi-file architecture",
      "Event-driven Kafka streaming pipeline",
      "Isolated container sandbox execution",
      "Real-time WebSocket client synchronization",
    ],
    accentColor: "blue",
  },
];

export function getProjectById(slug: string): Project | undefined {
  const normalized = slug.toLowerCase().trim();
  return PROJECTS.find(
    (p) => p.id === normalized || p.aliases.includes(normalized)
  );
}
