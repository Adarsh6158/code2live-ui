"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  User,
  Search,
  Star,
  Clock,
  Plus,
  Check,
  ShoppingBag,
  X,
  ArrowRight,
  MapPin,
  Flame,
  Terminal,
  FileCode,
  Layers,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Calendar,
  Kanban,
  RotateCw,
  Cpu,
  Boxes,
  CheckCircle2,
  Code2,
  Circle,
  CircleDot,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BITECRAFT_FILES,
  FLOWBOARD_FILES,
  BITECRAFT_TREE,
  FLOWBOARD_TREE,
  TreeNode,
  ProjectFile,
} from "@/data/ideFiles";
import { getSprintForDate, SprintInfo } from "@/utils/sprint";

export type AppType = "bitecraft" | "flowboard";

const BITECRAFT_GENERATION_SEQUENCE = [
  "src/App.jsx",
  "src/components/Navbar.jsx",
  "src/components/RestaurantCard.jsx",
  "src/components/Cart.jsx",
];

const FLOWBOARD_GENERATION_SEQUENCE = [
  "src/App.jsx",
  "src/components/KanbanBoard.jsx",
  "src/components/Column.jsx",
  "src/components/TaskCard.jsx",
];

interface CodeToLivePreviewProps {
  isReplaying?: boolean;
  onReplayComplete?: () => void;
  initialApp?: AppType;
  onAppChange?: (app: AppType) => void;
}

export type GenerationState =
  | "IDLE"
  | "PROMPT_SUBMITTED"
  | "ANALYZING"
  | "GENERATING_CODE"
  | "BUILDING"
  | "READY"
  | "PREVIEW_VISIBLE";

interface RestaurantItem {
  id: string;
  name: string;
  category: "Burgers" | "Pizza" | "Biryani";
  rating: number;
  reviews: string;
  time: string;
  delivery: string;
  featuredItem: string;
  price: number;
  image: string;
  badge: string;
}

const BITECRAFT_RESTAURANTS: RestaurantItem[] = [
  {
    id: "rest-1",
    name: "Leon's Burgers & Wings",
    category: "Burgers",
    rating: 4.8,
    reviews: "1.4k",
    time: "20-25 min",
    delivery: "Free",
    featuredItem: "Crispy Peri Peri Paneer Burger",
    price: 249,
    image: "/images/restaurants/burger.jpg",
    badge: "Bestseller",
  },
  {
    id: "rest-2",
    name: "Brik Oven Pizzeria",
    category: "Pizza",
    rating: 4.9,
    reviews: "2.1k",
    time: "25-35 min",
    delivery: "₹35",
    featuredItem: "Paneer Tikka Woodfired Pizza",
    price: 429,
    image: "/images/restaurants/pizza.jpg",
    badge: "Chef's Special",
  },
  {
    id: "rest-3",
    name: "Meghana Foods",
    category: "Biryani",
    rating: 4.9,
    reviews: "5.8k",
    time: "15-20 min",
    delivery: "Free",
    featuredItem: "Meghana Special Biryani",
    price: 329,
    image: "/images/restaurants/biryani.jpg",
    badge: "Bengaluru Icon",
  },
];

interface KanbanTask {
  id: string;
  key: string;
  title: string;
  tag: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  assignee: { name: string; initials: string };
}

const FLOWBOARD_INITIAL_TASKS: KanbanTask[] = [
  {
    id: "task-1",
    key: "FLOW-104",
    title: "Implement OAuth 2.0 PKCE Auth Flow",
    tag: "Security",
    description: "Secure API gateway with RFC 7636 authorization code grant.",
    status: "todo",
    priority: "High",
    dueDate: "Nov 12",
    assignee: { name: "Adarsh Kumar", initials: "AK" },
  },
  {
    id: "task-2",
    key: "FLOW-98",
    title: "Kafka Event Schema Registry Contracts",
    tag: "Streaming",
    description: "Publish Avro contracts for code generation streaming.",
    status: "in_progress",
    priority: "High",
    dueDate: "Today",
    assignee: { name: "Sarah Miller", initials: "SM" },
  },
  {
    id: "task-3",
    key: "FLOW-87",
    title: "Export Figma Design System Tokens",
    tag: "Design",
    description: "Export CSS variables for neutral dark & light palettes.",
    status: "in_progress",
    priority: "Medium",
    dueDate: "Tomorrow",
    assignee: { name: "Rohan Verma", initials: "RV" },
  },
  {
    id: "task-4",
    key: "FLOW-72",
    title: "KEDA Sandbox Autoscaler Configuration",
    tag: "DevOps",
    description: "Deploy KEDA metrics for container worker nodes.",
    status: "done",
    priority: "Low",
    dueDate: "Done",
    assignee: { name: "Adarsh Kumar", initials: "AK" },
  },
  {
    id: "task-5",
    key: "FLOW-112",
    title: "AST Code Streaming WebSocket Handler",
    tag: "Backend",
    description: "Stream syntax tokens to browser over bi-directional socket.",
    status: "todo",
    priority: "High",
    dueDate: "Nov 14",
    assignee: { name: "Sarah Miller", initials: "SM" },
  },
];

function renderSyntaxHighlight(line: string) {
  if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
    return <span className="text-[#6e7681] italic">{line}</span>;
  }
  const tokenRegex =
    /(".*?"|'.*?'|`.*?`|\b(?:import|export|default|from|function|return|const|let|var|if|else|switch|case|break)\b|<\/?[A-Za-z0-9_.-]+|\b(?:true|false|null|undefined|\d+)\b|[{}()[\].,;:])/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      parts.push(
        <span key={match.index} className="text-[#a5d6ff]">
          {token}
        </span>
      );
    } else if (
      /^(?:import|export|default|from|return|function)$/.test(token)
    ) {
      parts.push(
        <span key={match.index} className="text-[#ff7b72] font-medium">
          {token}
        </span>
      );
    } else if (/^(?:const|let|var)$/.test(token)) {
      parts.push(
        <span key={match.index} className="text-[#79c0ff]">
          {token}
        </span>
      );
    } else if (/^(?:true|false|null|undefined|\d+)$/.test(token)) {
      parts.push(
        <span key={match.index} className="text-[#d2a8ff]">
          {token}
        </span>
      );
    } else if (token.startsWith("<")) {
      parts.push(
        <span key={match.index} className="text-[#7ee787]">
          {token}
        </span>
      );
    } else {
      parts.push(
        <span key={match.index} className="text-[#8b949e]">
          {token}
        </span>
      );
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return (
    <span className="text-[#e6edf3]">
      {parts.length > 0 ? parts : line}
    </span>
  );
}

export function CodeToLivePreview({
  isReplaying = false,
  onReplayComplete,
  initialApp,
  onAppChange,
}: CodeToLivePreviewProps) {
  const getInitialApp = (): AppType => {
    if (initialApp) return initialApp;
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/kanban") return "flowboard";
      if (path === "/food") return "bitecraft";
    }
    return "bitecraft";
  };

  const [appType, setAppType] = useState<AppType>(getInitialApp);
  const [generationState, setGenerationState] = useState<GenerationState>("IDLE");
  const [mobileTab, setMobileTab] = useState<"chat" | "preview" | "code">("preview");

  const [typedUserPrompt, setTypedUserPrompt] = useState("");
  const [typedAiResponse, setTypedAiResponse] = useState("");

  const [activeFilePath, setActiveFilePath] = useState<string>("");
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [currentGeneratingFile, setCurrentGeneratingFile] = useState<string | null>(null);
  const [isFilesOpen, setIsFilesOpen] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    "src/components": true,
    "src/data": true,
    "src/hooks": false,
    "src/styles": false,
  });
  const [generatedCodeLineCount, setGeneratedCodeLineCount] = useState<number>(0);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number }[]>([
    { id: "init-1", name: "Crispy Peri Peri Paneer Burger", price: 249 },
    { id: "init-2", name: "Paneer Tikka Woodfired Pizza", price: 429 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(FLOWBOARD_INITIAL_TASKS);
  const [flowboardView, setFlowboardView] = useState<"board" | "list">("board");
  const [taskFilter, setTaskFilter] = useState<string>("All");
  const [sprintInfo, setSprintInfo] = useState<SprintInfo>(() =>
    getSprintForDate("2026-11-04")
  );

  useEffect(() => {
    const updateSprint = () => {
      setSprintInfo(getSprintForDate());
    };
    updateSprint();

    const interval = setInterval(updateSprint, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dwellSecondsLeftRef = useRef<number>(8);
  const isDwellActiveRef = useRef<boolean>(false);
  const lastUserInteractionTimeRef = useRef<number>(0);
  const completedCountRef = useRef<number>(0);
  const codeEditorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (generationState === "GENERATING_CODE" && codeEditorRef.current) {
      codeEditorRef.current.scrollTop = codeEditorRef.current.scrollHeight;
    }
  }, [generatedCodeLineCount, generationState]);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    intervalsRef.current.forEach((i) => clearInterval(i));
    intervalsRef.current = [];
    if (dwellTimerRef.current) {
      clearInterval(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
  }, []);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  }, []);

  const addInterval = useCallback((fn: () => void, ms: number) => {
    const i = setInterval(fn, ms);
    intervalsRef.current.push(i);
    return i;
  }, []);

  const recordUserInteraction = useCallback(() => {
    lastUserInteractionTimeRef.current = Date.now();
  }, []);

  const activeFilesMap: Record<string, ProjectFile> =
    appType === "bitecraft" ? BITECRAFT_FILES : FLOWBOARD_FILES;
  const activeTree: TreeNode[] =
    appType === "bitecraft" ? BITECRAFT_TREE : FLOWBOARD_TREE;

  const promptText =
    appType === "bitecraft"
      ? "Build a modern food delivery application with restaurant listings, food categories, and an interactive shopping cart."
      : "Build a modern project management application with a Kanban board, task priorities, team avatars, and interactive status columns.";

  const responseText =
    appType === "bitecraft"
      ? "I'll build a responsive food delivery experience with restaurant discovery, interactive menus, and cart functionality."
      : "I'll build FlowBoard: a responsive project management platform with customizable Kanban columns, priority tags, member assignees, and real-time task state management.";

  const startLifecycle = useCallback(
    (targetApp: AppType) => {
      clearAllTimers();
      setAppType(targetApp);
      if (onAppChange) {
        onAppChange(targetApp);
      }
      setGenerationState("PROMPT_SUBMITTED");
      setTypedUserPrompt("");
      setTypedAiResponse("");
      setGeneratedFiles([]);
      setCurrentGeneratingFile(null);
      setGeneratedCodeLineCount(0);
      setActiveFilePath("");
      setIsFilesOpen(false);
      setIsCartOpen(false);

      if (targetApp === "bitecraft") {
        setSelectedCategory("All");
        setSearchQuery("");
      } else {
        setKanbanTasks(FLOWBOARD_INITIAL_TASKS);
        setFlowboardView("board");
      }

      let p = 0;
      const targetPrompt =
        targetApp === "bitecraft"
          ? "Build a modern food delivery application with restaurant listings, food categories, and an interactive shopping cart."
          : "Build a modern project management application with a Kanban board, task priorities, team avatars, and interactive status columns.";

      const pInterval = addInterval(() => {
        p += 2;
        setTypedUserPrompt(targetPrompt.slice(0, p));
        if (p >= targetPrompt.length) {
          clearInterval(pInterval);

          addTimeout(() => {
            setGenerationState("ANALYZING");

            let a = 0;
            const targetResponse =
              targetApp === "bitecraft"
                ? "I'll build a responsive food delivery experience with restaurant discovery, interactive menus, and cart functionality."
                : "I'll build FlowBoard: a responsive project management platform with customizable Kanban columns, priority tags, member assignees, and real-time task state management.";

            const aInterval = addInterval(() => {
              a += 2;
              setTypedAiResponse(targetResponse.slice(0, a));
              if (a >= targetResponse.length) {
                clearInterval(aInterval);

                addTimeout(() => {
                  setGenerationState("GENERATING_CODE");
                  const sequence =
                    targetApp === "bitecraft"
                      ? BITECRAFT_GENERATION_SEQUENCE
                      : FLOWBOARD_GENERATION_SEQUENCE;
                  const targetFileMap =
                    targetApp === "bitecraft" ? BITECRAFT_FILES : FLOWBOARD_FILES;

                  const generateFileAtIndex = (index: number) => {
                    if (index >= sequence.length) {
                      setCurrentGeneratingFile(null);
                      setActiveFilePath("src/App.jsx");

                      addTimeout(() => {
                        setGenerationState("BUILDING");

                        addTimeout(() => {
                          setGenerationState("READY");

                          addTimeout(() => {
                            setGenerationState("PREVIEW_VISIBLE");
                            completedCountRef.current += 1;
                            if (onReplayComplete) onReplayComplete();
                          }, 800);
                        }, 1400);
                      }, 400);
                      return;
                    }

                    const nextFile = sequence[index];
                    setGeneratedFiles((prev) =>
                      prev.includes(nextFile) ? prev : [...prev, nextFile]
                    );
                    setActiveFilePath(nextFile);
                    setCurrentGeneratingFile(nextFile);
                    setGeneratedCodeLineCount(0);

                    const fileObj = targetFileMap[nextFile];
                    const totalLines = fileObj?.lines.length || 24;
                    let lineCount = 0;

                    const lineInterval = addInterval(() => {
                      lineCount = Math.min(lineCount + 2, totalLines);
                      setGeneratedCodeLineCount(lineCount);

                      if (lineCount >= totalLines) {
                        clearInterval(lineInterval);
                        addTimeout(() => {
                          generateFileAtIndex(index + 1);
                        }, 250);
                      }
                    }, 38);
                  };

                  generateFileAtIndex(0);
                }, 700);
              }
            }, 38);
          }, 600);
        }
      }, 28);
    },
    [addInterval, addTimeout, clearAllTimers, onAppChange, onReplayComplete]
  );

  const hasMountedRef = useRef(false);
  const startLifecycleRef = useRef(startLifecycle);

  useEffect(() => {
    startLifecycleRef.current = startLifecycle;
  }, [startLifecycle]);

  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;
    const resolvedApp: AppType = initialApp || "bitecraft";
    startLifecycleRef.current(resolvedApp);
  }, [initialApp]);

  useEffect(() => {
    if (isReplaying) {
      const timer = setTimeout(() => {
        startLifecycleRef.current(appType);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isReplaying, appType]);

  useEffect(() => {
    if (generationState !== "PREVIEW_VISIBLE") {
      return;
    }

    dwellSecondsLeftRef.current = 20;
    isDwellActiveRef.current = true;

    const nextApp: AppType = appType === "bitecraft" ? "flowboard" : "bitecraft";

    const interval = setInterval(() => {
      if (document.hidden) {
        return;
      }

      const isUserBusy = Date.now() - lastUserInteractionTimeRef.current < 2500;
      if (isUserBusy) {
        return;
      }

      dwellSecondsLeftRef.current -= 1;
      if (dwellSecondsLeftRef.current <= 0) {
        clearInterval(interval);
        isDwellActiveRef.current = false;
        startLifecycleRef.current(nextApp);
      }
    }, 1000);

    dwellTimerRef.current = interval;
    return () => {
      clearInterval(interval);
      dwellTimerRef.current = null;
    };
  }, [generationState, appType]);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const handleAddToCart = (restaurant: RestaurantItem) => {
    recordUserInteraction();
    setCartItems((prev) => [
      ...prev,
      { id: `${restaurant.id}-${Date.now()}`, name: restaurant.featuredItem, price: restaurant.price },
    ]);
    setAddedNoticeId(restaurant.id);
    setTimeout(() => {
      setAddedNoticeId((curr) => (curr === restaurant.id ? null : curr));
    }, 1200);
  };

  const handleRemoveFromCart = (index: number) => {
    recordUserInteraction();
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const filteredRestaurants = BITECRAFT_RESTAURANTS.filter((r) => {
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.featuredItem.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMoveKanbanTask = (taskId: string) => {
    recordUserInteraction();
    setKanbanTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus =
          t.status === "todo" ? "in_progress" : t.status === "in_progress" ? "done" : "todo";
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleAddKanbanTask = () => {
    recordUserInteraction();
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      key: `FLOW-${Math.floor(120 + Math.random() * 20)}`,
      title: "Automated Sandbox Build Telemetry",
      tag: "Infra",
      description: "Verify isolated Docker sandbox telemetry.",
      status: "todo",
      priority: "High",
      dueDate: "Tomorrow",
      assignee: { name: "Adarsh Kumar", initials: "AK" },
    };
    setKanbanTasks((prev) => [newTask, ...prev]);
  };

  const activeFileObject = activeFilesMap[activeFilePath] || activeFilesMap["src/App.jsx"];

  const isFileOrFolderVisible = (node: TreeNode): boolean => {
    if (
      generationState === "BUILDING" ||
      generationState === "READY" ||
      generationState === "PREVIEW_VISIBLE"
    ) {
      return true;
    }
    if (!node.isFolder) {
      return generatedFiles.includes(node.path);
    }
    return (node.children || []).some(isFileOrFolderVisible);
  };

  const renderMinimalTreeNode = (node: TreeNode, depth = 0): React.ReactNode => {
    if (!isFileOrFolderVisible(node)) {
      return null;
    }
    if (node.isFolder) {
      const isOpen = expandedFolders[node.path] ?? true;
      return (
        <div key={node.path} className="select-none">
          <button
            type="button"
            onClick={() => toggleFolder(node.path)}
            style={{ paddingLeft: `${depth * 10 + 6}px` }}
            className="w-full flex items-center gap-1.5 py-1 text-[11px] text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#1f242c]/70 rounded-md transition-colors text-left font-sans cursor-pointer group"
          >
            <ChevronRight
              className={`w-3 h-3 text-[#6e7681] group-hover:text-[#c9d1d9] transition-transform duration-150 ${isOpen ? "rotate-90" : ""
                }`}
            />
            {isOpen ? (
              <FolderOpen className="w-3.5 h-3.5 text-[#79c0ff]" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-[#79c0ff]" />
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {isOpen && node.children && (
            <div>{node.children.map((child) => renderMinimalTreeNode(child, depth + 1))}</div>
          )}
        </div>
      );
    }

    const isActive = activeFilePath === node.path;
    return (
      <button
        key={node.path}
        type="button"
        onClick={() => {
          recordUserInteraction();
          setActiveFilePath(node.path);
          setIsFilesOpen(false);
        }}
        style={{ paddingLeft: `${depth * 10 + 20}px` }}
        className={`w-full flex items-center justify-between py-1 px-2 text-[11px] font-mono rounded-md text-left transition-colors cursor-pointer truncate ${isActive
          ? "bg-[#1f242c] text-[#79c0ff] font-medium"
          : "text-[#c9d1d9] hover:bg-[#161b22] hover:text-white"
          }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <FileCode className={`w-3 h-3 ${isActive ? "text-[#79c0ff]" : "text-[#6e7681]"}`} />
          <span className="truncate">{node.name}</span>
        </div>
        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#79c0ff] shrink-0" />}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-[450px] sm:h-[475px] md:h-[500px] w-full bg-white text-[#171717] select-none overflow-hidden font-sans border-t border-[#e5e5e5]">

      <div className="flex lg:hidden h-8 px-3 bg-[#fafafa] border-b border-[#e5e5e5] items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#737373]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
          <span>{appType === "bitecraft" ? "BiteCraft App" : "FlowBoard App"}</span>
        </div>
        <div className="flex bg-[#f0f0f0] p-0.5 rounded-lg border border-[#e5e5e5] text-[10px] font-sans">
          <button
            onClick={() => setMobileTab("chat")}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${mobileTab === "chat" ? "bg-white text-[#171717] font-medium shadow-2xs" : "text-[#737373]"
              }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${mobileTab === "preview" ? "bg-white text-[#171717] font-medium shadow-2xs" : "text-[#737373]"
              }`}
          >
            Preview
          </button>
          <button
            onClick={() => setMobileTab("code")}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${mobileTab === "code" ? "bg-white text-[#171717] font-medium shadow-2xs" : "text-[#737373]"
              }`}
          >
            Code
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 bg-white">

        <div
          className={`${mobileTab === "chat" ? "flex" : "hidden"
            } lg:flex lg:w-[23%] flex-col border-r border-[#e5e5e5] bg-[#fafafa] min-h-0 relative select-text`}
        >
          <div className="px-3 py-2 border-b border-[#e5e5e5] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#171717] text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                AI
              </div>
              <div>
                <div className="text-xs font-semibold text-[#171717]">Code2Live Agent</div>
                <div className="text-[10px] text-[#737373] font-sans">
                  {appType === "bitecraft" ? "Consumer E-Commerce" : "Project Management"}
                </div>
              </div>
            </div>

            <div className="flex items-center bg-[#f0f0f0] p-0.5 rounded-lg border border-[#e5e5e5] text-[9.5px]">
              <button
                type="button"
                onClick={() => startLifecycle("bitecraft")}
                className={`px-1.5 py-0.5 rounded-md transition-colors ${appType === "bitecraft" ? "bg-white text-[#171717] font-semibold shadow-2xs" : "text-[#737373]"
                  }`}
                title="Switch to Food Delivery App"
              >
                Food
              </button>
              <button
                type="button"
                onClick={() => startLifecycle("flowboard")}
                className={`px-1.5 py-0.5 rounded-md transition-colors ${appType === "flowboard" ? "bg-white text-[#171717] font-semibold shadow-2xs" : "text-[#737373]"
                  }`}
                title="Switch to FlowBoard Kanban App"
              >
                Kanban
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 min-h-0 text-xs">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-[#e5e5e5] shrink-0 mt-0.5 relative shadow-2xs bg-neutral-100">
                <Image
                  src="/images/avatar.png"
                  alt="Adarsh Kumar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-2.5 rounded-xl bg-white border border-[#e5e5e5] text-[#171717] text-[11px] leading-relaxed shadow-2xs">
                <span className="text-[9px] font-sans font-semibold text-[#a3a3a3] block mb-0.5 uppercase tracking-wider">
                  Requirement
                </span>
                <span>{typedUserPrompt || "..."}</span>
                {generationState === "PROMPT_SUBMITTED" && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-[#171717] align-middle animate-pulse" />
                )}
              </div>
            </motion.div>

            {generationState !== "IDLE" && generationState !== "PROMPT_SUBMITTED" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-5 h-5 rounded-md bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 1.5L14 4.8V11.2L8 14.5L2 11.2V4.8L8 1.5Z"
                      stroke="#3f3f46"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 1.5V8M8 8L14 11.2M8 8L2 11.2"
                      stroke="#3b82f6"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="8" r="1.6" fill="#60a5fa" />
                  </svg>
                </div>
                <div className="flex-1 p-2.5 rounded-xl bg-white border border-[#e5e5e5] text-[#171717] text-[11px] leading-relaxed shadow-2xs">
                  <span className="text-[9px] font-sans font-semibold text-[#a3a3a3] block mb-0.5 uppercase tracking-wider">
                    Code2Live AI
                  </span>
                  <span>{typedAiResponse || "Understanding requirements..."}</span>

                  <div className="mt-2.5 pt-2 border-t border-[#f0f0f0] space-y-1.5 font-sans text-[10px]">
                    <div
                      className={`flex items-center gap-1.5 ${generationState === "ANALYZING"
                        ? "text-[#171717] font-medium"
                        : "text-[#52525b]"
                        }`}
                    >
                      {generationState === "ANALYZING" ? (
                        <div className="w-2.5 h-2.5 border-1.5 border-[#171717] border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <Check className="w-3 h-3 text-[#171717] stroke-[2.5] shrink-0" />
                      )}
                      <span>Understanding your requirements...</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${generationState === "GENERATING_CODE"
                        ? "text-[#171717] font-medium"
                        : generationState === "BUILDING" ||
                          generationState === "READY" ||
                          generationState === "PREVIEW_VISIBLE"
                          ? "text-[#52525b]"
                          : "text-[#a3a3a3]"
                        }`}
                    >
                      {generationState === "GENERATING_CODE" ? (
                        <div className="w-2.5 h-2.5 border-1.5 border-[#171717] border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : generationState === "BUILDING" ||
                        generationState === "READY" ||
                        generationState === "PREVIEW_VISIBLE" ? (
                        <Check className="w-3 h-3 text-[#171717] stroke-[2.5] shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-[#d4d4d8] shrink-0" />
                      )}
                      <span>
                        {generationState === "GENERATING_CODE" && currentGeneratingFile
                          ? `Creating ${currentGeneratingFile.split("/").pop()}...`
                          : "Creating your application components..."}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${generationState === "BUILDING"
                        ? "text-[#171717] font-medium"
                        : generationState === "READY" ||
                          generationState === "PREVIEW_VISIBLE"
                          ? "text-[#52525b]"
                          : "text-[#a3a3a3]"
                        }`}
                    >
                      {generationState === "BUILDING" ? (
                        <div className="w-2.5 h-2.5 border-1.5 border-[#171717] border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : generationState === "READY" ||
                        generationState === "PREVIEW_VISIBLE" ? (
                        <Check className="w-3 h-3 text-[#171717] stroke-[2.5] shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-[#d4d4d8] shrink-0" />
                      )}
                      <span>Putting everything together...</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${generationState === "READY" ||
                        generationState === "PREVIEW_VISIBLE"
                        ? "text-[#171717] font-medium"
                        : "text-[#a3a3a3]"
                        }`}
                    >
                      {generationState === "READY" ||
                        generationState === "PREVIEW_VISIBLE" ? (
                        <Check className="w-3 h-3 text-[#171717] stroke-[2.5] shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-[#d4d4d8] shrink-0" />
                      )}
                      <span>Your application is ready.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-2 border-t border-[#e5e5e5] bg-white shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] text-xs">
              <input
                type="text"
                placeholder={
                  appType === "bitecraft"
                    ? "Add delivery time filters..."
                    : "Add priority column..."
                }
                disabled
                className="w-full bg-transparent text-[11px] text-[#171717] placeholder:text-[#a3a3a3] focus:outline-none cursor-not-allowed"
              />
              <button
                type="button"
                disabled
                className="w-5 h-5 rounded-md bg-[#171717] text-white flex items-center justify-center opacity-40 shrink-0 cursor-not-allowed"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`${mobileTab === "preview" ? "flex" : "hidden"
            } lg:flex lg:w-[52%] flex-col border-r border-[#e5e5e5] min-h-0 relative bg-white`}
        >
          {generationState !== "PREVIEW_VISIBLE" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#fafafa] relative overflow-hidden select-none">
              <div className="absolute inset-0 p-4 pointer-events-none select-none opacity-25 flex flex-col gap-3">
                {appType === "bitecraft" ? (
                  <>
                    <div className="h-9 w-full rounded-lg bg-neutral-200/70 border border-neutral-300/40 flex items-center justify-between px-3">
                      <div className="w-16 h-3 rounded bg-neutral-300" />
                      <div className="w-28 h-4 rounded-md bg-neutral-300/60" />
                      <div className="w-8 h-4 rounded-md bg-neutral-300/60" />
                    </div>
                    <div className="h-20 w-full rounded-lg bg-neutral-200/50 border border-neutral-300/40 p-3 flex flex-col justify-end gap-1.5">
                      <div className="w-24 h-3 rounded bg-neutral-300" />
                      <div className="w-40 h-2 rounded bg-neutral-300/60" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1">
                      <div className="rounded-lg bg-neutral-200/40 border border-neutral-300/40 p-2 space-y-2">
                        <div className="h-14 rounded bg-neutral-300/60" />
                        <div className="w-3/4 h-2 rounded bg-neutral-300" />
                        <div className="w-1/2 h-2 rounded bg-neutral-300/60" />
                      </div>
                      <div className="rounded-lg bg-neutral-200/40 border border-neutral-300/40 p-2 space-y-2">
                        <div className="h-14 rounded bg-neutral-300/60" />
                        <div className="w-3/4 h-2 rounded bg-neutral-300" />
                        <div className="w-1/2 h-2 rounded bg-neutral-300/60" />
                      </div>
                      <div className="hidden sm:block rounded-lg bg-neutral-200/40 border border-neutral-300/40 p-2 space-y-2">
                        <div className="h-14 rounded bg-neutral-300/60" />
                        <div className="w-3/4 h-2 rounded bg-neutral-300" />
                        <div className="w-1/2 h-2 rounded bg-neutral-300/60" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-9 w-full rounded-lg bg-neutral-200/70 border border-neutral-300/40 flex items-center justify-between px-3">
                      <div className="w-20 h-3 rounded bg-neutral-300" />
                      <div className="w-32 h-4 rounded-md bg-neutral-300/60" />
                      <div className="w-12 h-4 rounded-md bg-neutral-300/60" />
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 flex-1">
                      <div className="rounded-lg bg-neutral-200/40 border border-neutral-300/40 p-2 space-y-2">
                        <div className="w-16 h-3 rounded bg-neutral-300/70" />
                        <div className="h-12 rounded bg-neutral-300/50" />
                        <div className="h-12 rounded bg-neutral-300/50" />
                      </div>
                      <div className="rounded-lg bg-neutral-200/40 border border-neutral-300/40 p-2 space-y-2">
                        <div className="w-16 h-3 rounded bg-neutral-300/70" />
                        <div className="h-12 rounded bg-neutral-300/50" />
                        <div className="h-12 rounded bg-neutral-300/50" />
                      </div>
                      <div className="rounded-lg bg-neutral-200/40 border border-neutral-300/40 p-2 space-y-2">
                        <div className="w-16 h-3 rounded bg-neutral-300/70" />
                        <div className="h-12 rounded bg-neutral-300/50" />
                        <div className="h-12 rounded bg-neutral-300/50" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative z-10 px-6 py-5 rounded-xl bg-white/80 backdrop-blur-md border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_16px_36px_-6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col items-center justify-center max-w-[280px] w-full space-y-3">
                {(generationState === "ANALYZING" ||
                  generationState === "GENERATING_CODE" ||
                  generationState === "BUILDING") && (
                    <>
                      <div className="w-4 h-4 border-[1.5px] border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
                      <div className="space-y-1">
                        <p className="text-[12px] font-semibold text-neutral-900 tracking-tight">Building your application</p>
                        <p className="text-[11px] text-neutral-500 font-sans">
                          {generationState === "ANALYZING" && "Understanding application requirements..."}
                          {generationState === "GENERATING_CODE" && `Creating ${activeFileObject.name.replace("src/", "")}...`}
                          {generationState === "BUILDING" && "Putting everything together..."}
                        </p>
                      </div>
                      <div className="w-44 h-1 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/50">
                        <div
                          className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
                          style={{
                            width:
                              generationState === "ANALYZING"
                                ? "25%"
                                : generationState === "GENERATING_CODE"
                                  ? `${25 + Math.round((generatedCodeLineCount / Math.max(activeFileObject.lines.length, 1)) * 60)}%`
                                  : "94%",
                          }}
                        />
                      </div>
                    </>
                  )}

                {generationState === "READY" && (
                  <>
                    <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-3 h-3 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-semibold text-neutral-900 tracking-tight">Application ready</p>
                      <p className="text-[11px] text-neutral-500 font-sans">Rendering live preview...</p>
                    </div>
                  </>
                )}

                {(generationState === "IDLE" || generationState === "PROMPT_SUBMITTED") && (
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-neutral-600">Ready to build</p>
                    <p className="text-[11px] text-neutral-400 font-sans">Waiting for prompt submission...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {generationState === "PREVIEW_VISIBLE" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 flex flex-col min-h-0 bg-white relative"
            >
              {appType === "bitecraft" && (
                <div className="flex-1 flex flex-col min-h-0 bg-[#ffffff] relative">
                  <div className="h-11 px-3 sm:px-4 border-b border-[#f0f0f0] flex items-center justify-between shrink-0 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="font-bold text-xs tracking-tight text-[#171717]">BiteCraft</span>
                      <span className="text-[#e5e5e5] font-light">/</span>
                      <span className="text-[11px] text-[#737373] hidden sm:flex items-center gap-1 font-sans">
                        <MapPin className="w-3 h-3 text-[#737373]" /> Bengaluru, KA
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        recordUserInteraction();
                        setIsCartOpen(!isCartOpen);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171717] hover:bg-[#303030] text-white text-[11px] font-sans font-medium transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{cartItems.length} items</span>
                      <span className="hidden sm:inline text-white/60">•</span>
                      <span className="hidden sm:inline text-white/90">₹{cartTotal.toLocaleString("en-IN")}</span>
                    </button>
                  </div>

                  <div className="px-3 sm:px-4 py-2 border-b border-[#f0f0f0] space-y-2 bg-white shrink-0">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] text-xs">
                      <Search className="w-3.5 h-3.5 text-[#a3a3a3] shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          recordUserInteraction();
                          setSearchQuery(e.target.value);
                        }}
                        placeholder="Search burgers, pizza, biryani..."
                        className="w-full bg-transparent text-[11px] text-[#171717] placeholder:text-[#a3a3a3] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                      {(["All", "Burgers", "Pizza", "Biryani"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            recordUserInteraction();
                            setSelectedCategory(cat);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium transition-all shrink-0 cursor-pointer ${selectedCategory === cat
                            ? "bg-[#171717] text-white shadow-2xs"
                            : "bg-[#f5f5f5] text-[#737373] hover:text-[#171717] hover:bg-[#e5e5e5]"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                      <span className="text-[10.5px] text-[#737373] font-sans font-normal ml-auto hidden sm:flex items-center gap-1">
                        Free delivery in 25m
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto min-h-0 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredRestaurants.map((rest) => (
                        <div
                          key={rest.id}
                          className="p-2 rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#d4d4d8] transition-all flex flex-col justify-between group/card"
                        >
                          <div>
                            <div className="relative h-24 sm:h-26 w-full rounded-xl overflow-hidden bg-neutral-100 mb-2">
                              <Image
                                src={rest.image}
                                alt={rest.name}
                                fill
                                priority
                                loading="eager"
                                sizes="(max-width: 768px) 100vw, 300px"
                                className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded-md bg-white/95 text-[9px] font-sans font-semibold text-[#171717] shadow-xs">
                                {rest.badge}
                              </span>
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded-md bg-[#171717]/85 text-[9px] font-sans font-medium text-white shadow-xs flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" /> {rest.time}
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between gap-1">
                              <h3 className="font-semibold text-xs text-[#171717] truncate">{rest.name}</h3>
                              <span className="text-[10.5px] font-medium text-[#78350f] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 font-sans shrink-0 flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                                <span>{rest.rating}</span>
                              </span>
                            </div>

                            <p className="text-[10.5px] text-[#737373] truncate font-sans mt-0.5">
                              {rest.featuredItem} • ₹{rest.price}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(rest)}
                            className={`mt-2 w-full py-1.5 rounded-xl text-[11px] font-sans font-medium transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98] ${addedNoticeId === rest.id
                              ? "bg-[#262626] text-white shadow-xs"
                              : "bg-[#171717] hover:bg-[#303030] text-white shadow-2xs"
                              }`}
                          >
                            {addedNoticeId === rest.id ? (
                              <>
                                <Check className="w-3 h-3 text-white" />
                                <span>Added to Cart!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Add to Cart • ₹{rest.price}</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCartOpen && (
                      <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-y-0 right-0 w-64 bg-white border-l border-[#e5e5e5] shadow-xl p-3 flex flex-col justify-between z-20"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-1.5">
                              <ShoppingBag className="w-3.5 h-3.5 text-[#171717]" />
                              <h4 className="font-semibold text-xs text-[#171717]">
                                Your Basket ({cartItems.length})
                              </h4>
                            </div>
                            <button
                              onClick={() => {
                                recordUserInteraction();
                                setIsCartOpen(false);
                              }}
                              className="p-1 rounded-md text-[#737373] hover:text-[#171717] hover:bg-[#f5f5f5]"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="py-2 space-y-2 max-h-52 overflow-y-auto">
                            {cartItems.map((item, idx) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-[#fafafa] border border-[#f0f0f0]"
                              >
                                <div className="truncate pr-1">
                                  <span className="font-medium text-[#171717] block truncate text-[11px]">
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] text-[#737373]">₹{item.price}</span>
                                </div>
                                <button
                                  onClick={() => handleRemoveFromCart(idx)}
                                  className="text-[10px] text-[#a3a3a3] hover:text-red-600 font-sans p-1"
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#f0f0f0] space-y-2">
                          <div className="flex justify-between text-xs font-semibold text-[#171717]">
                            <span>Total</span>
                            <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              recordUserInteraction();
                              alert(`Order confirmed for ${cartItems.length} items! Total: ₹${cartTotal.toLocaleString("en-IN")}`);
                            }}
                            className="w-full py-2 rounded-xl bg-[#171717] hover:bg-[#303030] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] cursor-pointer"
                          >
                            <span>Checkout Order</span>
                            <ArrowRight className="w-3.5 h-3.5 text-white/80" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {appType === "flowboard" && (
                <div className="flex-1 flex flex-col min-h-0 bg-[#fafafa] text-[#18181b]">
                  <div className="h-11 px-3 sm:px-4 border-b border-[#e5e5e5] bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-[6px] bg-[#18181b] border border-[#27272a] flex items-center justify-center shadow-2xs shrink-0">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <rect x="2" y="3" width="3.2" height="10" rx="1.2" fill="#71717a" />
                          <rect x="6.4" y="1.5" width="3.2" height="13" rx="1.2" fill="#d4d4d8" />
                          <rect x="10.8" y="4.5" width="3.2" height="8.5" rx="1.2" fill="#3b82f6" />
                        </svg>
                      </div>
                      <span className="font-semibold text-xs tracking-tight text-[#171717]">FlowBoard</span>
                      <span className="text-[#d4d4d8] font-light">/</span>
                      <span className="text-[11px] font-medium text-[#737373]">
                        Sprint {sprintInfo.sprintNumber}
                      </span>
                      <span className="hidden sm:inline-flex items-center text-[10.5px] text-[#71717a] font-sans font-normal ml-0.5">
                        <span className="text-[#d4d4d8] mx-1.5 font-light">/</span>
                        <span>{sprintInfo.formattedDateRange}</span>
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                          {sprintInfo.status}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center p-0.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-[10px] font-medium select-none">
                        <button
                          type="button"
                          onClick={() => {
                            recordUserInteraction();
                            setFlowboardView("board");
                          }}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            flowboardView === "board"
                              ? "bg-white text-[#18181b] shadow-2xs font-semibold"
                              : "text-[#71717a] hover:text-[#18181b]"
                          }`}
                        >
                          Board
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            recordUserInteraction();
                            setFlowboardView("list");
                          }}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            flowboardView === "list"
                              ? "bg-white text-[#18181b] shadow-2xs font-semibold"
                              : "text-[#71717a] hover:text-[#18181b]"
                          }`}
                        >
                          List
                        </button>
                      </div>

                      <div className="flex items-center -space-x-1.5 pl-1">
                        <span className="w-5 h-5 rounded-full bg-[#18181b] text-white font-medium text-[8px] flex items-center justify-center ring-2 ring-white">
                          AK
                        </span>
                        <span className="w-5 h-5 rounded-full bg-[#4f46e5] text-white font-medium text-[8px] flex items-center justify-center ring-2 ring-white">
                          SM
                        </span>
                        <span className="w-5 h-5 rounded-full bg-[#475569] text-white font-medium text-[8px] flex items-center justify-center ring-2 ring-white">
                          RV
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddKanbanTask}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#171717] hover:bg-black text-white text-[11px] font-sans font-medium transition-all active:scale-[0.98] shadow-2xs cursor-pointer ml-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New Task</span>
                      </button>
                    </div>
                  </div>

                  {flowboardView === "board" ? (
                    <div className="flex-1 p-3 overflow-x-auto overflow-y-hidden min-h-0 bg-[#fafafa]">
                      <div className="grid grid-cols-3 gap-2.5 h-full min-w-[500px]">
                        <div className="flex flex-col h-full bg-[#f4f4f5]/70 rounded-xl border border-[#e4e4e7] p-2 overflow-hidden">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e4e4e7]/70">
                            <div className="flex items-center gap-1.5">
                              <Circle className="w-3.5 h-3.5 text-[#a1a1aa] stroke-[1.5]" />
                              <span className="text-[11.5px] font-semibold text-[#18181b] tracking-tight">To Do</span>
                              <span className="text-[11px] font-sans font-normal text-[#a1a1aa] ml-0.5">
                                {kanbanTasks.filter((t) => t.status === "todo").length}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddKanbanTask}
                              title="Add task"
                              className="p-1 rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                            {kanbanTasks
                              .filter((t) => t.status === "todo")
                              .map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => handleMoveKanbanTask(task.id)}
                                  className="p-2.5 rounded-lg bg-white border border-[#e4e4e7] shadow-2xs hover:border-[#a1a1aa] hover:shadow-xs transition-all cursor-pointer group/card select-none"
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11.5px] font-sans font-medium text-[#71717a]">
                                        {task.key}
                                      </span>
                                      <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                                        {task.tag}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-sans font-medium text-[#71717a] group-hover/card:text-[#18181b] opacity-0 group-hover/card:opacity-100 transition-opacity">
                                      Start →
                                    </span>
                                  </div>
                                  <h4 className="text-[12px] font-medium text-[#18181b] leading-snug line-clamp-2 my-1.5">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#f4f4f5] text-[10px] font-sans text-[#71717a]">
                                    <div className="flex items-center gap-1.5">
                                      {task.priority === "High" ? (
                                        <span className="inline-flex items-center gap-0.5 text-rose-600 font-medium">
                                          <Flame className="w-2.5 h-2.5 text-rose-500" /> High
                                        </span>
                                      ) : (
                                        <span className="text-[#71717a] font-medium">{task.priority}</span>
                                      )}
                                      <span className="text-[#d4d4d8]">•</span>
                                      <span className="inline-flex items-center gap-1 text-[#71717a]">
                                        <Calendar className="w-2.5 h-2.5 text-[#a1a1aa]" /> {task.dueDate}
                                      </span>
                                    </div>
                                    <span className="w-4.5 h-4.5 rounded-full bg-[#18181b] text-white font-medium text-[8px] flex items-center justify-center ring-1 ring-white shrink-0">
                                      {task.assignee.initials}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="flex flex-col h-full bg-[#f4f4f5]/70 rounded-xl border border-[#e4e4e7] p-2 overflow-hidden">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e4e4e7]/70">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3.5 h-3.5 rounded-full border border-[#d97706]/70 flex items-center justify-center shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                              </div>
                              <span className="text-[11.5px] font-semibold text-[#18181b] tracking-tight">In Progress</span>
                              <span className="text-[11px] font-sans font-normal text-[#a1a1aa] ml-0.5">
                                {kanbanTasks.filter((t) => t.status === "in_progress").length}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddKanbanTask}
                              title="Add task"
                              className="p-1 rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                            {kanbanTasks
                              .filter((t) => t.status === "in_progress")
                              .map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => handleMoveKanbanTask(task.id)}
                                  className="p-2.5 rounded-lg bg-white border border-[#e4e4e7] shadow-2xs hover:border-[#a1a1aa] hover:shadow-xs transition-all cursor-pointer group/card select-none"
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11.5px] font-sans font-medium text-[#71717a]">
                                        {task.key}
                                      </span>
                                      <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                                        {task.tag}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-sans font-medium text-[#71717a] group-hover/card:text-[#18181b] opacity-0 group-hover/card:opacity-100 transition-opacity">
                                      Done →
                                    </span>
                                  </div>
                                  <h4 className="text-[12px] font-medium text-[#18181b] leading-snug line-clamp-2 my-1.5">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#f4f4f5] text-[10px] font-sans text-[#71717a]">
                                    <div className="flex items-center gap-1.5">
                                      {task.priority === "High" ? (
                                        <span className="inline-flex items-center gap-0.5 text-rose-600 font-medium">
                                          <Flame className="w-2.5 h-2.5 text-rose-500" /> High
                                        </span>
                                      ) : (
                                        <span className="text-[#71717a] font-medium">{task.priority}</span>
                                      )}
                                      <span className="text-[#d4d4d8]">•</span>
                                      <span className="inline-flex items-center gap-1 text-[#71717a]">
                                        <Calendar className="w-2.5 h-2.5 text-[#a1a1aa]" /> {task.dueDate}
                                      </span>
                                    </div>
                                    <span className="w-4.5 h-4.5 rounded-full bg-[#4f46e5] text-white font-medium text-[8px] flex items-center justify-center ring-1 ring-white shrink-0">
                                      {task.assignee.initials}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="flex flex-col h-full bg-[#f4f4f5]/70 rounded-xl border border-[#e4e4e7] p-2 overflow-hidden">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e4e4e7]/70">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3.5 h-3.5 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                              </div>
                              <span className="text-[11.5px] font-semibold text-[#18181b] tracking-tight">Completed</span>
                              <span className="text-[11px] font-sans font-normal text-[#a1a1aa] ml-0.5">
                                {kanbanTasks.filter((t) => t.status === "done").length}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddKanbanTask}
                              title="Add task"
                              className="p-1 rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                            {kanbanTasks
                              .filter((t) => t.status === "done")
                              .map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => handleMoveKanbanTask(task.id)}
                                  className="p-2.5 rounded-lg bg-white border border-[#e4e4e7] shadow-2xs hover:border-[#a1a1aa] hover:shadow-xs transition-all cursor-pointer group/card opacity-80 select-none"
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11.5px] font-sans font-medium text-[#71717a]">
                                        {task.key}
                                      </span>
                                      <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
                                        {task.tag}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-sans font-medium text-[#71717a] opacity-0 group-hover/card:opacity-100 transition-opacity">
                                      Reopen ↺
                                    </span>
                                  </div>
                                  <h4 className="text-[12px] font-medium leading-snug line-through text-[#a1a1aa] line-clamp-2 my-1.5">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#f4f4f5] text-[10px] font-sans text-[#71717a]">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-3 h-3 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center shrink-0">
                                        <Check className="w-2 h-2 stroke-[2.5]" />
                                      </div>
                                      <span className="text-[10px] text-[#71717a] font-medium">Done</span>
                                    </div>
                                    <span className="w-4.5 h-4.5 rounded-full bg-[#18181b] text-white font-medium text-[8px] flex items-center justify-center ring-1 ring-white shrink-0">
                                      {task.assignee.initials}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 p-3 overflow-y-auto min-h-0 bg-[#fafafa] space-y-3 select-none">
                      <div className="bg-white rounded-xl border border-[#e4e4e7] shadow-2xs overflow-hidden">
                        <div className="px-3 py-2 bg-[#f4f4f5]/80 border-b border-[#e4e4e7] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Circle className="w-3.5 h-3.5 text-[#a1a1aa] stroke-[1.5]" />
                            <span className="text-[11.5px] font-semibold text-[#18181b] tracking-tight">To Do</span>
                            <span className="text-[11px] font-sans font-normal text-[#a1a1aa] ml-0.5">
                              {kanbanTasks.filter((t) => t.status === "todo").length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddKanbanTask}
                            title="Add task"
                            className="p-1 rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="divide-y divide-[#f4f4f5]">
                          {kanbanTasks
                            .filter((t) => t.status === "todo")
                            .map((task) => (
                              <div
                                key={task.id}
                                onClick={() => handleMoveKanbanTask(task.id)}
                                className="px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-[#fafafa] transition-colors cursor-pointer group/row"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className="w-4 h-4 rounded-full border border-[#d4d4d8] group-hover/row:border-[#18181b] flex items-center justify-center shrink-0 transition-colors">
                                    <Circle className="w-2.5 h-2.5 text-transparent group-hover/row:text-[#a1a1aa] fill-current transition-colors" />
                                  </div>
                                  <span className="text-[11.5px] font-sans font-medium text-[#71717a] shrink-0">
                                    {task.key}
                                  </span>
                                  <h4 className="text-[12px] font-medium text-[#18181b] truncate">
                                    {task.title}
                                  </h4>
                                  <span className="hidden sm:inline-flex text-[9.5px] font-sans font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] shrink-0">
                                    {task.tag}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0 text-[10px] font-sans text-[#71717a]">
                                  {task.priority === "High" ? (
                                    <span className="inline-flex items-center gap-0.5 text-rose-600 font-medium">
                                      <Flame className="w-2.5 h-2.5 text-rose-500" /> High
                                    </span>
                                  ) : (
                                    <span className="text-[#71717a] font-medium">{task.priority}</span>
                                  )}
                                  <span className="hidden md:inline-flex items-center gap-1 text-[#71717a]">
                                    <Calendar className="w-2.5 h-2.5 text-[#a1a1aa]" /> {task.dueDate}
                                  </span>
                                  <span className="w-4.5 h-4.5 rounded-full bg-[#18181b] text-white font-medium text-[8px] flex items-center justify-center ring-1 ring-white shrink-0">
                                    {task.assignee.initials}
                                  </span>
                                  <span className="text-[10px] font-medium text-[#18181b] opacity-0 group-hover/row:opacity-100 transition-opacity hidden sm:inline-block">
                                    Start →
                                  </span>
                                </div>
                              </div>
                            ))}
                          {kanbanTasks.filter((t) => t.status === "todo").length === 0 && (
                            <div className="px-3 py-3 text-center text-[11px] text-[#a1a1aa] font-sans">
                              No tasks to do
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#e4e4e7] shadow-2xs overflow-hidden">
                        <div className="px-3 py-2 bg-[#f4f4f5]/80 border-b border-[#e4e4e7] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-full border border-[#d97706]/70 flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                            </div>
                            <span className="text-[11.5px] font-semibold text-[#18181b] tracking-tight">In Progress</span>
                            <span className="text-[11px] font-sans font-normal text-[#a1a1aa] ml-0.5">
                              {kanbanTasks.filter((t) => t.status === "in_progress").length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddKanbanTask}
                            title="Add task"
                            className="p-1 rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="divide-y divide-[#f4f4f5]">
                          {kanbanTasks
                            .filter((t) => t.status === "in_progress")
                            .map((task) => (
                              <div
                                key={task.id}
                                onClick={() => handleMoveKanbanTask(task.id)}
                                className="px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-[#fafafa] transition-colors cursor-pointer group/row"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className="w-4 h-4 rounded-full border border-[#d97706] flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                                  </div>
                                  <span className="text-[11.5px] font-sans font-medium text-[#71717a] shrink-0">
                                    {task.key}
                                  </span>
                                  <h4 className="text-[12px] font-medium text-[#18181b] truncate">
                                    {task.title}
                                  </h4>
                                  <span className="hidden sm:inline-flex text-[9.5px] font-sans font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] shrink-0">
                                    {task.tag}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0 text-[10px] font-sans text-[#71717a]">
                                  {task.priority === "High" ? (
                                    <span className="inline-flex items-center gap-0.5 text-rose-600 font-medium">
                                      <Flame className="w-2.5 h-2.5 text-rose-500" /> High
                                    </span>
                                  ) : (
                                    <span className="text-[#71717a] font-medium">{task.priority}</span>
                                  )}
                                  <span className="hidden md:inline-flex items-center gap-1 text-[#71717a]">
                                    <Calendar className="w-2.5 h-2.5 text-[#a1a1aa]" /> {task.dueDate}
                                  </span>
                                  <span className="w-4.5 h-4.5 rounded-full bg-[#4f46e5] text-white font-medium text-[8px] flex items-center justify-center ring-1 ring-white shrink-0">
                                    {task.assignee.initials}
                                  </span>
                                  <span className="text-[10px] font-medium text-[#18181b] opacity-0 group-hover/row:opacity-100 transition-opacity hidden sm:inline-block">
                                    Done →
                                  </span>
                                </div>
                              </div>
                            ))}
                          {kanbanTasks.filter((t) => t.status === "in_progress").length === 0 && (
                            <div className="px-3 py-3 text-center text-[11px] text-[#a1a1aa] font-sans">
                              No tasks in progress
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#e4e4e7] shadow-2xs overflow-hidden opacity-90">
                        <div className="px-3 py-2 bg-[#f4f4f5]/80 border-b border-[#e4e4e7] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                            </div>
                            <span className="text-[11.5px] font-semibold text-[#18181b] tracking-tight">Completed</span>
                            <span className="text-[11px] font-sans font-normal text-[#a1a1aa] ml-0.5">
                              {kanbanTasks.filter((t) => t.status === "done").length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddKanbanTask}
                            title="Add task"
                            className="p-1 rounded text-[#a1a1aa] hover:text-[#18181b] hover:bg-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="divide-y divide-[#f4f4f5]">
                          {kanbanTasks
                            .filter((t) => t.status === "done")
                            .map((task) => (
                              <div
                                key={task.id}
                                onClick={() => handleMoveKanbanTask(task.id)}
                                className="px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-[#fafafa] transition-colors cursor-pointer group/row opacity-75"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className="w-4 h-4 rounded-full bg-[#5e6ad2] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                  </div>
                                  <span className="text-[11.5px] font-sans font-medium text-[#71717a] shrink-0">
                                    {task.key}
                                  </span>
                                  <h4 className="text-[12px] font-medium text-[#a1a1aa] line-through truncate">
                                    {task.title}
                                  </h4>
                                  <span className="hidden sm:inline-flex text-[9.5px] font-sans font-medium px-1.5 py-0.5 rounded-md bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7] shrink-0">
                                    {task.tag}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0 text-[10px] font-sans text-[#71717a]">
                                  <span className="text-[10px] text-[#71717a] font-medium">Done</span>
                                  <span className="w-4.5 h-4.5 rounded-full bg-[#18181b] text-white font-medium text-[8px] flex items-center justify-center ring-1 ring-white shrink-0">
                                    {task.assignee.initials}
                                  </span>
                                  <span className="text-[10px] font-medium text-[#71717a] opacity-0 group-hover/row:opacity-100 transition-opacity hidden sm:inline-block">
                                    Reopen ↺
                                  </span>
                                </div>
                              </div>
                            ))}
                          {kanbanTasks.filter((t) => t.status === "done").length === 0 && (
                            <div className="px-3 py-3 text-center text-[11px] text-[#a1a1aa] font-sans">
                              No completed tasks yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div
          className={`${mobileTab === "code" ? "flex" : "hidden"
            } lg:flex lg:w-[25%] flex-col bg-[#111318] text-[#e6edf3] font-mono min-h-0 relative select-text overflow-hidden`}
        >
          <div className="h-7 px-2.5 bg-[#111318] border-b border-[#22242a] flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#c9d1d9] shrink-0">
              <Code2 className="w-3.5 h-3.5 text-[#8b949e]" />
              <span className="text-[11px] font-sans font-medium">Code</span>
            </div>

            <button
              type="button"
              onClick={() => {
                recordUserInteraction();
                setIsFilesOpen((prev) => !prev);
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-sans transition-colors cursor-pointer border shrink-0 ${
                isFilesOpen
                  ? "bg-[#1f242c] text-[#f0f6fc] border-[#38444d]"
                  : "bg-[#161b22] text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#1f242c] border-[#22242a]"
              }`}
              title="Browse all project files"
            >
              <Folder className="w-3 h-3 text-[#8b949e]" />
              <span className="text-[10px]">Files</span>
              <ChevronDown
                className={`w-2.5 h-2.5 transition-transform duration-150 ${
                  isFilesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="h-7 px-1.5 bg-[#0d0f12] border-b border-[#22242a] flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0 select-none">
            {generatedFiles.length === 0 ? (
              <div className="px-2 text-[10px] text-[#484f58] font-sans flex items-center gap-1.5">
                <span>No files generated yet</span>
              </div>
            ) : (
              generatedFiles.map((path) => {
                const fileObj = activeFilesMap[path];
                const fileName = fileObj ? fileObj.name : path.split("/").pop();
                const isActive = activeFilePath === path;
                const isGeneratingThis = currentGeneratingFile === path;
                return (
                  <motion.button
                    key={path}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    type="button"
                    onClick={() => {
                      recordUserInteraction();
                      setActiveFilePath(path);
                      setIsFilesOpen(false);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? "bg-[#1f242c] text-[#f0f6fc] font-medium border border-[#30363d] shadow-2xs"
                        : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]/70 border border-transparent"
                    }`}
                    title={path}
                  >
                    {isGeneratingThis && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#79c0ff] animate-ping" />
                    )}
                    <span className={isActive ? "text-[#79c0ff]" : "text-[#8b949e]"}>
                      {fileName}
                    </span>
                  </motion.button>
                );
              })
            )}
          </div>

          <AnimatePresence>
            {isFilesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[57px] inset-x-0 bottom-0 z-30 bg-[#111318]/95 backdrop-blur-md border-b border-[#22242a] flex flex-col p-2.5 select-none shadow-2xl"
              >
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#22242a] text-[10.5px]">
                  <span className="font-semibold text-[#c9d1d9] tracking-tight">
                    Project Files ({appType === "bitecraft" ? "BiteCraft" : "FlowBoard"})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFilesOpen(false)}
                    className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#1f242c] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-[#22242a]">
                  {generatedFiles.length === 0 ? (
                    <div className="p-4 text-center text-[10.5px] text-[#6e7681]">
                      No files created yet
                    </div>
                  ) : (
                    activeTree.map((item) => renderMinimalTreeNode(item))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            ref={codeEditorRef}
            className="flex-1 p-2.5 overflow-y-auto overflow-x-auto text-[9.5px] sm:text-[10px] leading-[1.65] font-mono scrollbar-thin scrollbar-thumb-[#22242a] scrollbar-track-transparent select-text"
          >
            {generationState === "IDLE" ||
            generationState === "PROMPT_SUBMITTED" ||
            generationState === "ANALYZING" ||
            generatedFiles.length === 0 ? (
              <div className="flex gap-2 items-baseline pt-0.5 select-none">
                <span className="w-6 text-right text-[#484f58] select-none text-[8.5px] sm:text-[9px] font-mono pr-1.5 shrink-0">
                  1
                </span>
                <span className="inline-block w-[1.5px] h-3.5 bg-neutral-300 animate-pulse align-middle" />
              </div>
            ) : (
              <>
                {(() => {
                  const isCurrentFileBeingGenerated =
                    generationState === "GENERATING_CODE" &&
                    activeFilePath === currentGeneratingFile;
                  const linesToRender = isCurrentFileBeingGenerated
                    ? activeFileObject.lines.slice(0, generatedCodeLineCount)
                    : activeFileObject.lines;

                  if (isCurrentFileBeingGenerated && generatedCodeLineCount === 0) {
                    return (
                      <div className="flex gap-2 items-baseline px-2 py-0.2 bg-[#1f242c] border-l-2 border-[#79c0ff]">
                        <span className="w-6 text-right text-[#79c0ff] select-none text-[8.5px] sm:text-[9px] font-mono pr-1.5 shrink-0">
                          1
                        </span>
                        <span className="inline-block w-[1.5px] h-3.5 bg-[#79c0ff] animate-pulse align-middle" />
                      </div>
                    );
                  }

                  return linesToRender.map((line, idx) => {
                    const isCurrentTypingLine =
                      isCurrentFileBeingGenerated &&
                      idx === generatedCodeLineCount - 1;
                    return (
                      <div
                        key={idx}
                        className={`flex gap-2 items-baseline px-2 py-0.2 rounded-xs transition-colors ${
                          isCurrentTypingLine
                            ? "bg-[#1f242c] border-l-2 border-[#79c0ff]"
                            : "hover:bg-[#161b22]/70"
                        }`}
                      >
                        <span
                          className={`w-6 text-right select-none text-[8.5px] sm:text-[9px] font-mono pr-1.5 shrink-0 ${
                            isCurrentTypingLine
                              ? "text-[#79c0ff] font-semibold"
                              : "text-[#484f58]"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex-1 whitespace-pre flex items-center">
                          {renderSyntaxHighlight(line)}
                          {isCurrentTypingLine && (
                            <span className="inline-block w-[1.5px] h-3.5 bg-[#79c0ff] animate-pulse align-middle ml-0.5" />
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
