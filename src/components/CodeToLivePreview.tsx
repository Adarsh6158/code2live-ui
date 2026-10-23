"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Terminal,
  FileCode,
  CheckCircle2,
  Activity,
  Cpu,
  Clock,
  Radio,
  ChevronDown,
  Search,
  Settings,
  GitBranch,
  Send,
  User,
  Dice5,
  Kanban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeToLivePreviewProps {
  isReplaying?: boolean;
  onReplayComplete?: () => void;
}

type DemoPhase =
  | "ide_view"
  | "cursor_moving"
  | "typing_mvn"
  | "booting_spring"
  | "prompt_typing"
  | "prompt_moving_up"
  | "ai_generating"
  | "live_ready";

interface CodeLine {
  num: number;
  tokens: { text: string; color: string }[];
}

interface ShowcaseProject {
  id: string;
  name: string;
  prompt: string;
  mainFile: string;
  topic: string;
  codeLines: CodeLine[];
}

const SPRING_BANNER = [
  "  .   ____          _            __ _ _",
  " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\",
  "( ( )\\___ | '_ | '_| | '_ \\/ _` | \\ \\ \\ \\",
  " \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )",
  "  '  |____| .__|_| |_|_| |_\\__, | / / / /",
  " =========|_|==============|___/=/_/_/_/",
  " :: Spring Boot :: (v3.3.4)",
];

const BOOT_LOGS = [
  "[INFO] Initializing Spring AI Multi-Agent Pipeline",
  "[INFO] Connected to Kafka Broker (topic: codegen.req)",
  "[INFO] Tomcat started on port 8080 (http) with context ''",
  "✓ Started Code2LiveApplication in 0.82 seconds",
];

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "snake_ladder",
    name: "Snake & Ladder Multiplayer",
    prompt: "Create a real-time Snake and Ladder game with multiplayer WebSockets & interactive board",
    mainFile: "SnakeLadderEngine.java",
    topic: "/topic/board-state",
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: "@RestController", color: "text-amber-400 font-semibold" },
          { text: ' @RequestMapping("/api/snake-ladder")', color: "text-emerald-400 font-medium" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "public class ", color: "text-purple-400 font-medium" },
          { text: "SnakeLadderEngine ", color: "text-blue-300 font-bold" },
          { text: "implements ", color: "text-purple-400 font-medium" },
          { text: "GameSession ", color: "text-cyan-300 font-semibold" },
          { text: "{", color: "text-slate-300" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "  @Autowired ", color: "text-amber-400 font-medium" },
          { text: "private SimpMessagingTemplate template;", color: "text-slate-200" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "  private final Map<Integer, Integer> snakes = Map.of(", color: "text-slate-300" },
          { text: "99, 10, 75, 30, 52, 16", color: "text-amber-300 font-mono" },
          { text: ");", color: "text-slate-300" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  private final Map<Integer, Integer> ladders = Map.of(", color: "text-slate-300" },
          { text: "4, 25, 21, 60, 42, 81", color: "text-emerald-300 font-mono" },
          { text: ");", color: "text-slate-300" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "  @MessageMapping(\"/roll\")", color: "text-amber-400 font-medium" },
          { text: "  @SendTo(\"/topic/board-state\")", color: "text-amber-400 font-medium" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "  public GameState ", color: "text-purple-400 font-medium" },
          { text: "rollDice", color: "text-blue-400 font-bold" },
          { text: "(PlayerMove move) {", color: "text-slate-300" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "    int dice = ThreadLocalRandom.current().nextInt(1, 7);", color: "text-slate-200" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "    int target = calculateNextCell(move.getCurrent(), dice);", color: "text-slate-200" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "    return new GameState(move.getPlayerId(), dice, target, checkWin(target));", color: "text-emerald-300 font-semibold" },
        ],
      },
      {
        num: 11,
        tokens: [{ text: "  }", color: "text-slate-300" }],
      },
      {
        num: 12,
        tokens: [{ text: "}", color: "text-slate-300" }],
      },
    ],
  },
  {
    id: "kanban_board",
    name: "Collaborative Kanban Platform",
    prompt: "Build real-time Kanban board with Kafka event streaming, WebSocket sync & live drag-drop",
    mainFile: "KanbanEventPipeline.java",
    topic: "/topic/kanban-updates",
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: "@RestController", color: "text-amber-400 font-semibold" },
          { text: ' @RequestMapping("/api/kanban")', color: "text-emerald-400 font-medium" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "public class ", color: "text-purple-400 font-medium" },
          { text: "KanbanEventPipeline ", color: "text-blue-300 font-bold" },
          { text: "extends ", color: "text-purple-400 font-medium" },
          { text: "EventBridge ", color: "text-cyan-300 font-semibold" },
          { text: "{", color: "text-slate-300" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "  @Autowired ", color: "text-amber-400 font-medium" },
          { text: "private KafkaTemplate<String, TaskEvent> kafka;", color: "text-slate-200" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "  @Autowired ", color: "text-amber-400 font-medium" },
          { text: "private SimpMessagingTemplate wsTemplate;", color: "text-slate-200" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  @KafkaListener", color: "text-amber-400 font-medium" },
          { text: '(topics = "', color: "text-slate-300" },
          { text: "kanban.events", color: "text-emerald-300" },
          { text: '", groupId = "code2live-ui")', color: "text-slate-300" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "  @MessageMapping(\"/task/move\")", color: "text-amber-400 font-medium" },
          { text: "  @SendTo(\"/topic/kanban-updates\")", color: "text-amber-400 font-medium" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "  public TaskState ", color: "text-purple-400 font-medium" },
          { text: "handleTaskMove", color: "text-blue-400 font-bold" },
          { text: "(TaskMovePayload payload) {", color: "text-slate-300" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "    kafka.send(\"kanban.events\", payload.getTaskId(), payload);", color: "text-slate-200" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "    TaskState state = taskService.transition(payload);", color: "text-slate-200" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "    return state.withBroadcastTimestamp(Instant.now());", color: "text-emerald-300 font-semibold" },
        ],
      },
      {
        num: 11,
        tokens: [{ text: "  }", color: "text-slate-300" }],
      },
      {
        num: 12,
        tokens: [{ text: "}", color: "text-slate-300" }],
      },
    ],
  },
];

const MVN_COMMAND = "./mvnw spring-boot:run";

export function CodeToLivePreview({
  isReplaying = false,
  onReplayComplete,
}: CodeToLivePreviewProps) {
  const [projectIndex, setProjectIndex] = useState(0);
  const currentProject = SHOWCASE_PROJECTS[projectIndex];

  const [phase, setPhase] = useState<DemoPhase>("ide_view");
  const [typedCommand, setTypedCommand] = useState("");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [streamIndex, setStreamIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"app" | "telemetry">("app");
  const [mobileView, setMobileView] = useState<"code" | "preview">("preview");

  // Dice simulation state for Snake & Ladder
  const [diceValue, setDiceValue] = useState(6);
  const [playerPosition, setPlayerPosition] = useState(42);
  const [gameMessage, setGameMessage] = useState("Climbed Ladder to Cell 81!");

  // Kanban simulation state
  const [kanbanStage, setKanbanStage] = useState(0);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    intervalsRef.current.forEach((i) => clearInterval(i));
    intervalsRef.current = [];
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

  const startSequence = useCallback(
    (projIdx: number) => {
      clearAllTimers();
      setPhase("ide_view");
      setTypedCommand("");
      setTypedPrompt("");
      setStreamIndex(0);

      const proj = SHOWCASE_PROJECTS[projIdx];

      // Phase 1 -> 2: Let user admire VS Code Spring Boot workstation (1.8s)
      addTimeout(() => {
        setPhase("cursor_moving");

        // Cursor glides down directly to TERMINAL tab over 1.3s and taps it
        addTimeout(() => {
          setPhase("typing_mvn");

          // Type `./mvnw spring-boot:run` at deliberate, realistic speed (~70ms per char)
          let c = 0;
          const typeInterval = addInterval(() => {
            c++;
            setTypedCommand(MVN_COMMAND.slice(0, c));
            if (c >= MVN_COMMAND.length) {
              clearInterval(typeInterval);

              // 600ms pause after command is typed (simulating pressing Enter)
              addTimeout(() => {
                setPhase("booting_spring");

                // Keep Spring Boot banner & logs readable for 2.8 seconds!
                addTimeout(() => {
                  setPhase("prompt_typing");

                  // Type project prompt into ChatGPT input box (1 char every 30ms)
                  let p = 0;
                  const promptInterval = addInterval(() => {
                    p++;
                    setTypedPrompt(proj.prompt.slice(0, p));
                    if (p >= proj.prompt.length) {
                      clearInterval(promptInterval);

                      // 450ms pause then SEND the prompt -> prompt animates slowly up into chat feed!
                      addTimeout(() => {
                        setPhase("prompt_moving_up");

                        // 650ms for prompt to glide up into conversation, then AI begins generating below
                        addTimeout(() => {
                          setPhase("ai_generating");

                          // Stream code line-by-line one-by-one like ChatGPT streaming (1 line every 120ms)
                          let line = 0;
                          const streamInterval = addInterval(() => {
                            line++;
                            setStreamIndex(line);
                            if (line >= proj.codeLines.length) {
                              clearInterval(streamInterval);

                              // 500ms pause after all lines are generated -> Live Ready App!
                              addTimeout(() => {
                                setPhase("live_ready");
                                if (onReplayComplete) onReplayComplete();

                                // Stay on live demo for 7.5 SECONDS before rotating to next project
                                addTimeout(() => {
                                  setProjectIndex((prev) => (prev + 1) % SHOWCASE_PROJECTS.length);
                                }, 7500);
                              }, 500);
                            }
                          }, 120);
                        }, 650);
                      }, 450);
                    }
                  }, 30);
                }, 2800);
              }, 600);
            }
          }, 70);
        }, 1300);
      }, 1800);
    },
    [addInterval, addTimeout, clearAllTimers, onReplayComplete]
  );

  // Trigger sequence whenever projectIndex changes
  useEffect(() => {
    const t = setTimeout(() => {
      startSequence(projectIndex);
    }, 50);

    return () => {
      clearTimeout(t);
      clearAllTimers();
    };
  }, [projectIndex, startSequence, clearAllTimers]);

  // Handle explicit Replay button click from parent
  useEffect(() => {
    if (!isReplaying) return;
    const t = setTimeout(() => {
      startSequence(projectIndex);
    }, 10);
    return () => clearTimeout(t);
  }, [isReplaying, projectIndex, startSequence]);

  // Periodic dice roll in live ready state for Snake & Ladder
  useEffect(() => {
    if (phase !== "live_ready" || currentProject.id !== "snake_ladder") return;

    const interval = setInterval(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      setPlayerPosition((prev) => {
        const next = prev + roll > 100 ? prev + roll - 100 : prev + roll;
        if (next === 52) setGameMessage("Bitten by Snake! Down to 16");
        else if (next === 21) setGameMessage("Climbed Ladder to 60!");
        else setGameMessage(`Player rolled ${roll} • Moved to cell ${next}`);
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [phase, currentProject.id]);

  // Periodic card moves in live ready state for Kanban Board
  useEffect(() => {
    if (phase !== "live_ready" || currentProject.id !== "kanban_board") return;

    const interval = setInterval(() => {
      setKanbanStage((prev) => (prev + 1) % 3);
    }, 2400);

    return () => clearInterval(interval);
  }, [phase, currentProject.id]);

  // Auto-scroll ChatGPT conversation stream smoothly as prompt types and code streams
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [typedPrompt, streamIndex, phase]);

  return (
    <div className="flex flex-col h-[385px] sm:h-[415px] md:h-[445px] w-full bg-white text-slate-800 select-none overflow-hidden font-sans border-t border-slate-200/90">
      {/* Top Bar: Prompt status on right, view toggles on mobile */}
      <div className="flex items-center justify-between px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-50 border-b border-slate-200/80 text-[11px] shrink-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate flex-1 min-w-0">
          <div className="flex items-center justify-center w-4 h-4 rounded-md bg-blue-500/10 text-blue-600 shrink-0">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
          <span className="text-slate-500 font-mono hidden sm:inline text-[10.5px]">Prompt:</span>
          <span className="text-slate-800 font-mono font-medium truncate text-[10.5px] sm:text-[11px]">
            &quot;{typedPrompt || currentProject.prompt}&quot;
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop/Tablet Phase badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-white text-slate-700 border border-slate-200 shadow-2xs">
            <span>
              {phase === "ide_view" && "VS Code Workspace"}
              {phase === "cursor_moving" && "Navigating to Terminal"}
              {phase === "typing_mvn" && "Running ./mvnw spring-boot:run"}
              {phase === "booting_spring" && "Spring Boot Initializing..."}
              {phase === "prompt_typing" && "ChatGPT Prompt Composer"}
              {phase === "prompt_moving_up" && "Sending Prompt Requirement..."}
              {phase === "ai_generating" && "Spring AI Synthesizing AST..."}
              {phase === "live_ready" && `Demo ${projectIndex + 1}/2 • Active`}
            </span>
          </span>

          {/* Mobile view toggle */}
          <div className="flex sm:hidden bg-slate-200/80 rounded-md p-0.5 border border-slate-200 text-[10.5px]">
            <button
              onClick={() => setMobileView("code")}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${mobileView === "code" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600"
                }`}
            >
              Code
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${mobileView === "preview" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600"
                }`}
            >
              App
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 bg-white">
        {/* ========================================================================= */}
        {/* LEFT PANEL: Pixel-Perfect VS Code Workstation from Reference Screenshot    */}
        {/* ========================================================================= */}
        <div
          className={`${mobileView === "code" ? "flex" : "hidden"
            } md:flex md:col-span-6 flex-col border-r border-[#252526] bg-[#1e1e1e] text-slate-200 font-mono text-[11px] min-h-0 relative overflow-hidden`}
        >
          {/* 1. IDE VIEW & MVN RUNNING STAGES (AUTHENTIC VS CODE WORKSTATION) */}
          {(phase === "ide_view" ||
            phase === "cursor_moving" ||
            phase === "typing_mvn" ||
            phase === "booting_spring") && (
              <div className="flex flex-col h-full w-full bg-[#1e1e1e]">
                {/* VS Code macOS Title Bar */}
                <div className="flex items-center justify-between px-2.5 sm:px-3 bg-[#252526] border-b border-[#333333] text-[10px] text-slate-300 h-8 shrink-0 select-none">
                  {/* Traffic lights */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>

                  {/* Center Search Pill */}
                  <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-md bg-[#2d2d2d] border border-[#3c3c3c] text-[10px] text-[#cccccc] font-sans shadow-xs w-44 sm:w-56 mx-auto">
                    <Search className="w-2.5 h-2.5 text-[#858585] shrink-0" />
                    <span className="truncate">code2live-engine</span>
                  </div>

                  {/* Right VS Code Window Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 text-[#858585]">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2zm6 9H2V4h6v8zm1 0V4h5v8H9z" />
                    </svg>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 13V4h12v9H2z" />
                      <path d="M10 4h4v9h-4z" />
                    </svg>
                  </div>
                </div>

                {/* Workstation Body: Activity Bar + Explorer + (Editor & Terminal) */}
                <div className="flex-1 flex min-h-0 bg-[#1e1e1e]">
                  {/* 1. Activity Bar (Far Left) - Compact on mobile to maximize Editor & Terminal room */}
                  <div className="w-7 sm:w-11 bg-[#333333] border-r border-[#252526] flex flex-col justify-between py-1.5 sm:py-2 shrink-0 select-none">
                    <div className="flex flex-col gap-2.5 sm:gap-3">
                      {/* File Explorer (Active, White border indicator) */}
                      <div className="flex items-center justify-center relative border-l-2 border-white text-white py-0.5 sm:py-1">
                        <svg className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </div>
                      {/* Search */}
                      <div className="flex items-center justify-center text-[#858585] hover:text-[#cccccc] py-0.5">
                        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      {/* Source Control with Blue Badge 4 */}
                      <div className="flex items-center justify-center relative py-0.5 sm:py-1 text-[#858585] hover:text-[#cccccc] cursor-default">
                        <div className="relative">
                          <GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="absolute -top-1 -right-1.5 min-w-[11px] h-[11px] sm:min-w-[13px] sm:h-[13px] px-0.5 rounded-full bg-[#007acc] text-white text-[6.5px] sm:text-[7.5px] font-bold flex items-center justify-center leading-none shadow-xs">
                            4
                          </span>
                        </div>
                      </div>
                      {/* Run/Debug */}
                      <div className="flex items-center justify-center text-[#858585] hover:text-[#cccccc] py-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                      </div>
                      {/* Extensions */}
                      <div className="flex items-center justify-center text-[#858585] hover:text-[#cccccc] py-0.5">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect width="6" height="6" x="3" y="3" rx="1" />
                          <rect width="6" height="6" x="14" y="3" rx="1" />
                          <rect width="6" height="6" x="14" y="14" rx="1" />
                          <rect width="6" height="6" x="3" y="14" rx="1" />
                        </svg>
                      </div>
                    </div>

                    {/* Settings Gear */}
                    <div className="flex items-center justify-center text-[#858585] hover:text-[#cccccc] py-0.5 sm:py-1">
                      <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>

                  {/* 2. Explorer Sidebar (Middle Left: Authentic Spring Boot Backend Tree, Slimmed on Mobile) */}
                  <div className="w-20 sm:w-36 bg-[#252526] border-r border-[#1e1e1e] flex flex-col shrink-0 select-none overflow-hidden text-[8px] sm:text-[10px] font-sans py-1.5 sm:py-2">
                    <div className="px-1.5 sm:px-2.5 pb-1 text-[7.5px] sm:text-[8.5px] font-bold text-[#cccccc] tracking-wider uppercase">
                      EXPLORER
                    </div>
                    <div className="flex flex-col gap-0.5 text-[#cccccc]">
                      {/* v src/main/java */}
                      <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 hover:bg-[#2a2d2e] cursor-default text-amber-400">
                        <ChevronDown className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" />
                        <span className="font-medium truncate">src/main/java</span>
                      </div>

                      {/* v com.code2live */}
                      <div className="flex items-center gap-1 pl-2.5 sm:pl-4 pr-1 sm:pr-2 py-0.5 hover:bg-[#2a2d2e] cursor-default text-slate-300">
                        <ChevronDown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-slate-400 shrink-0" />
                        <span className="truncate">com.code2live</span>
                      </div>

                      {/* Code2LiveApplication.java (ACTIVE ROW WITH BLUE ACCENT) */}
                      <div className="flex items-center gap-1.5 pl-3 sm:pl-6 pr-1 sm:pr-2 py-0.5 bg-[#37373d] text-white border-l-2 border-[#007acc] font-medium cursor-default truncate">
                        <Image
                          src="/icons/Java.svg"
                          alt="Java"
                          width={14}
                          height={14}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0"
                        />
                        <span className="truncate text-blue-200">Code2LiveApp.java</span>
                      </div>

                      {/* KafkaPipelineEngine.java */}
                      <div className="flex items-center gap-1.5 pl-3 sm:pl-6 pr-1 sm:pr-2 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400">
                        <Image
                          src="/icons/Java.svg"
                          alt="Java"
                          width={14}
                          height={14}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0"
                        />
                        <span className="truncate">KafkaPipeline.java</span>
                      </div>

                      {/* RedisStateCache.java */}
                      <div className="flex items-center gap-1.5 pl-3 sm:pl-6 pr-1 sm:pr-2 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400">
                        <Image
                          src="/icons/Java.svg"
                          alt="Java"
                          width={14}
                          height={14}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0"
                        />
                        <span className="truncate">RedisStateCache.java</span>
                      </div>

                      {/* DockerSandboxService.java */}
                      <div className="flex items-center gap-1.5 pl-3 sm:pl-6 pr-1 sm:pr-2 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400">
                        <Image
                          src="/icons/Docker.svg"
                          alt="Docker"
                          width={14}
                          height={14}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0"
                        />
                        <span className="truncate">DockerSandbox.java</span>
                      </div>

                      {/* WebSocketSessionManager.java */}
                      <div className="flex items-center gap-1.5 pl-3 sm:pl-6 pr-1 sm:pr-2 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400">
                        <Image
                          src="/icons/Java.svg"
                          alt="Java"
                          width={14}
                          height={14}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0"
                        />
                        <span className="truncate">WebSocketSession.java</span>
                      </div>

                      {/* SpringAiPromptController.java */}
                      <div className="flex items-center gap-1.5 pl-3 sm:pl-6 pr-1 sm:pr-2 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400">
                        <Image
                          src="/icons/Java.svg"
                          alt="Java"
                          width={14}
                          height={14}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0"
                        />
                        <span className="truncate">SpringAiPrompt.java</span>
                      </div>

                      {/* v resources */}
                      <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 hover:bg-[#2a2d2e] cursor-default mt-0.5 text-slate-400">
                        <ChevronDown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-slate-500 shrink-0" />
                        <span className="truncate">resources</span>
                      </div>

                      {/* application.yml */}
                      <div className="flex items-center gap-1 pl-2.5 sm:pl-5 pr-1 sm:pr-2 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400">
                        <span className="px-0.5 rounded text-[6.5px] sm:text-[7px] font-bold bg-amber-600/80 text-white leading-none">YML</span>
                        <span className="truncate">application.yml</span>
                      </div>

                      {/* Dockerfile */}
                      <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400 mt-0.5">
                        <Image
                          src="/icons/Docker.svg"
                          alt="Docker"
                          width={12}
                          height={12}
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 object-contain shrink-0"
                        />
                        <span className="truncate">Dockerfile</span>
                      </div>

                      {/* pom.xml */}
                      <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 hover:bg-[#2a2d2e] cursor-default truncate text-slate-400 mt-0.5">
                        <span className="px-0.5 rounded text-[6.5px] sm:text-[7px] font-bold bg-blue-600 text-white leading-none">XML</span>
                        <span className="truncate">pom.xml</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Right Column: Editor + Terminal Drawer */}
                  <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e] relative overflow-hidden">

                    {/* Top: Editor Pane (Spring Boot Java Source Code) */}
                    <div className="h-[38%] flex flex-col min-h-0 border-b border-[#333333]">
                      {/* Tab: Code2LiveApplication.java */}
                      <div className="h-7 bg-[#252526] border-b border-[#1e1e1e] flex items-center px-1 shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1e1e] border-t-2 border-[#007acc] text-[#ffffff] text-[9px] sm:text-[9.5px] font-sans">
                          <Image
                            src="/icons/Java.svg"
                            alt="Java"
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5 object-contain shrink-0"
                          />
                          <span>Code2LiveApplication.java</span>
                        </div>
                      </div>

                      {/* Spring Boot Java Syntax-Highlighted Code */}
                      <div className="p-2 sm:p-2.5 font-mono text-[9px] sm:text-[10px] leading-[1.6] select-none text-slate-300 overflow-hidden flex-1">
                        <div className="text-slate-500 italic">&#47;&#47; Spring Boot Multi-Agent Autonomous Engine</div>
                        <div>
                          <span className="text-[#c586c0]">package </span>
                          <span className="text-[#cccccc]">com.code2live.engine;</span>
                        </div>
                        <div className="h-0.5" />
                        <div>
                          <span className="text-[#4ec9b0] font-semibold">@SpringBootApplication</span>
                        </div>
                        <div>
                          <span className="text-[#4ec9b0] font-semibold">@EnableKafka</span>
                        </div>
                        <div>
                          <span className="text-[#c586c0]">public class </span>
                          <span className="text-[#4fc1ff] font-bold">Code2LiveApplication </span>
                          <span className="text-[#ffd700]">&#123;</span>
                        </div>
                        <div className="pl-3 truncate">
                          <span className="text-[#c586c0]">public static void </span>
                          <span className="text-[#dcdcaa]">main</span>
                          <span className="text-[#ffd700]">(</span>
                          <span className="text-[#4fc1ff]">String</span>
                          <span className="text-[#cccccc]">[] args</span>
                          <span className="text-[#ffd700]">) &#123;</span>
                        </div>
                        <div className="pl-6 truncate">
                          <span className="text-[#4fc1ff]">SpringApplication</span>
                          <span className="text-[#cccccc]">.</span>
                          <span className="text-[#dcdcaa]">run</span>
                          <span className="text-[#cccccc]">(Code2LiveApplication.</span>
                          <span className="text-[#c586c0]">class</span>
                          <span className="text-[#cccccc]">, args);</span>
                        </div>
                        <div className="pl-3"><span className="text-[#ffd700]">&#125;</span></div>
                        <div><span className="text-[#ffd700]">&#125;</span></div>
                      </div>
                    </div>

                    {/* Bottom: Terminal Drawer */}
                    <div className="h-[62%] flex flex-col min-h-0 bg-[#1e1e1e]">
                      {/* Terminal Tabs Row (Active tab TERMINAL with blue underline indicator) */}
                      <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-3 py-1 bg-[#1e1e1e] border-b border-[#252526] text-[8.5px] sm:text-[9.5px] font-sans tracking-wider uppercase text-[#858585] shrink-0 select-none">
                        <span>PROBLEMS</span>
                        <span>OUTPUT</span>
                        <span>CONSOLE</span>
                        <span className="text-white font-semibold border-b-2 border-blue-500 pb-0.5 relative shrink-0">
                          TERMINAL

                          {/* Virtual Mouse Cursor: Glides gracefully down directly onto the TERMINAL tab! */}
                          <AnimatePresence>
                            {(phase === "ide_view" || phase === "cursor_moving") && (
                              <motion.div
                                initial={{ x: -35, y: -65, opacity: 0 }}
                                animate={
                                  phase === "cursor_moving"
                                    ? { x: 8, y: 10, opacity: 1, scale: [1, 1, 0.88, 1] }
                                    : { x: -35, y: -65, opacity: 0.9, scale: 1 }
                                }
                                exit={{ opacity: 0 }}
                                transition={
                                  phase === "cursor_moving"
                                    ? { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
                                    : { duration: 0.4 }
                                }
                                className="absolute z-50 pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                              >
                                <div className="relative">
                                  <svg
                                    className="w-4.5 h-4.5 text-white fill-white stroke-slate-900 stroke-[1.5]"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                                  </svg>
                                  <span className="absolute left-4.5 -top-1 px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[8px] font-semibold shadow-md border border-blue-400/30 whitespace-nowrap">
                                    Execute ./mvnw
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </span>
                        <span className="hidden sm:inline">PORTS</span>
                      </div>

                      {/* Terminal Body */}
                      <div className="flex-1 px-2 sm:px-2.5 py-1.5 overflow-y-auto text-[9px] sm:text-[10px] font-mono leading-relaxed space-y-1 bg-[#1e1e1e]">
                        {/* Command Prompt: Guaranteed Single Clean Line with no word breaking */}
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[9.5px] font-mono whitespace-nowrap overflow-x-auto scrollbar-none text-slate-300 py-0.5">
                          <span className="text-[#519aba] font-medium shrink-0">adarsh@mac:~/code2live</span>
                          <span className="text-emerald-400 font-bold shrink-0">$</span>
                          <span className="text-white font-medium shrink-0">
                            {typedCommand}
                            {(phase === "ide_view" ||
                              phase === "cursor_moving" ||
                              phase === "typing_mvn") && (
                                <span className="inline-block w-1.5 h-3 ml-0.5 bg-white align-middle animate-pulse" />
                              )}
                          </span>
                        </div>

                        {/* Spring Boot Booting Logs, Logo & Crisp ASCII Banner */}
                        {phase === "booting_spring" && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-1 mt-0.5 font-mono select-none overflow-x-auto scrollbar-none"
                          >
                            {/* Official Spring Boot Hexagon Logo from project assets + Version Header */}
                            <div className="flex items-center gap-2 pb-1 border-b border-emerald-900/40">
                              <div className="w-5 h-5 rounded-md bg-[#252526] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                                <Image
                                  src="/icons/SpringBoot.png"
                                  width={16}
                                  height={16}
                                  alt="Spring Boot"
                                  className="rounded-xs shrink-0"
                                />
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] font-sans">
                                <span className="font-bold text-white tracking-wide">Spring Boot</span>
                                <span className="text-emerald-400 font-mono text-[8.5px] px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 font-medium">v3.3.4</span>
                                <span className="text-slate-400 text-[8px] font-mono">• OpenJDK 21 LTS</span>
                              </div>
                            </div>

                            {/* Crisp ASCII Art Banner (Pure pre tag with monospace tracking-normal) */}
                            <div className="overflow-x-auto scrollbar-none py-0.5">
                              <pre
                                className="spring-ascii-art font-mono text-[6.5px] sm:text-[7.5px] leading-[1.18] text-[#6db33f] font-normal tracking-normal select-none m-0 p-0 whitespace-pre"
                                style={{
                                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                  fontVariantLigatures: 'none',
                                  fontFeatureSettings: '"liga" 0, "calt" 0',
                                  letterSpacing: '0px',
                                }}
                              >
                                {SPRING_BANNER.join("\n")}
                              </pre>
                            </div>

                            {/* Boot Logs */}
                            <div className="pt-0.5 space-y-0.5 text-[8px] sm:text-[8.5px]">
                              {BOOT_LOGS.map((log, i) => (
                                <div
                                  key={i}
                                  className={`truncate ${log.startsWith("✓")
                                    ? "text-emerald-300 font-semibold"
                                    : "text-slate-400"
                                    }`}
                                >
                                  {log}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* 2. CHATGPT CONTINUOUS CONVERSATION STREAM (PROMPT -> SCROLL UP -> CODE STREAMING) */}
          {(phase === "prompt_typing" ||
            phase === "prompt_moving_up" ||
            phase === "ai_generating" ||
            phase === "live_ready") && (
              <div className="flex flex-col h-full w-full p-3 sm:p-3.5 bg-[#1e1e1e] justify-between overflow-hidden">
                {/* ChatGPT Conversation Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#2d2d2d] shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#252526] border border-[#333333] flex items-center justify-center shrink-0 shadow-xs">
                      <Image src="/icons/AI.svg" width={15} height={15} alt="AI" className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Code2Live</div>
                      <div className="text-[9.5px] text-[#858585] font-mono">GPT-4o • Spring AI AST Engine</div>
                    </div>
                  </div>

                  {/* Clean, Professional Status Typography (No glowing dot, no rounded box) */}
                  <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 select-none">
                    <span className="text-slate-400 font-medium">
                      {phase === "prompt_typing" && "Requirement Input"}
                      {phase === "prompt_moving_up" && "Pipeline Triggered"}
                      {phase === "ai_generating" && "Streaming AST"}
                      {phase === "live_ready" && "Ready"}
                    </span>
                  </div>
                </div>

                {/* Scrollable Conversation Stream (Auto-scrolls down like ChatGPT as code is written) */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 py-2.5 overflow-y-auto space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent"
                >
                  {/* Initial ChatGPT greeting when typing prompt */}
                  {phase === "prompt_typing" && (
                    <div className="flex-1 h-full flex flex-col items-center justify-center text-center p-4 select-none opacity-90">
                      <div className="w-10 h-10 rounded-xl bg-[#252526] border border-[#333333] flex items-center justify-center mb-2 shadow-sm">
                        <Image src="/icons/AI.svg" width={22} height={22} alt="AI" className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold text-white tracking-tight">Code2Live Spring AI Engine</div>
                      <div className="text-[10px] text-[#858585] mt-1 max-w-[240px] leading-relaxed">
                        Type requirements below to synthesize full-stack Spring Boot architecture
                      </div>
                    </div>
                  )}

                  {/* Message 1: User Prompt Bubble (Slides smoothly UP from input bar into feed) */}
                  {(phase === "prompt_moving_up" || phase === "ai_generating" || phase === "live_ready") && (
                    <motion.div
                      initial={{ opacity: 0, y: 35, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3 h-3" />
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-xl bg-[#252526] border border-[#333333] text-slate-200 text-[11px] leading-relaxed shadow-md max-w-[95%]">
                        <span className="text-[#858585] font-mono text-[9px] block mb-1">PROMPT REQUIREMENT</span>
                        <span>{typedPrompt || currentProject.prompt}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Message 2: AI Assistant Response with Embedded Code Block */}
                  {(phase === "ai_generating" || phase === "live_ready") && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-md bg-[#252526] border border-[#333333] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Image src="/icons/AI.svg" width={14} height={14} alt="AI" className="w-3 h-3" />
                      </div>
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="text-[10px] sm:text-[10.5px] text-[#cccccc] leading-relaxed">
                          Synthesizing full-stack Spring Boot architecture with Kafka pipeline &amp; WebSocket session:
                        </div>

                        {/* Embedded ChatGPT Code Block */}
                        <div className="rounded-xl overflow-hidden border border-[#333333] bg-[#1e1e1e] shadow-md">
                          {/* Code Header Bar */}
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-[10px] text-slate-400 font-mono">
                            <div className="flex items-center gap-1.5 truncate">
                              <Image
                                src="/icons/Java.svg"
                                alt="Java"
                                width={14}
                                height={14}
                                className="w-3.5 h-3.5 object-contain shrink-0"
                              />
                              <span className="text-slate-200 font-medium truncate">{currentProject.mainFile}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[#858585] text-[9px]">Java • Spring Boot</span>
                              <span className="text-[#cccccc] text-[9px] px-1.5 py-0.5 rounded bg-[#2d2d2d] border border-[#3c3c3c] cursor-default">
                                Copy code
                              </span>
                            </div>
                          </div>

                          {/* Streaming Code Lines */}
                          <div className="p-2.5 max-h-[160px] sm:max-h-[180px] overflow-y-auto space-y-1 font-mono text-[10px] sm:text-[10.5px] leading-relaxed scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent">
                            {currentProject.codeLines.slice(0, streamIndex).map((line) => (
                              <div key={line.num} className="flex gap-2.5 items-center">
                                <span className="w-4 text-right text-slate-500 select-none text-[9.5px] shrink-0">
                                  {line.num}
                                </span>
                                <div className="flex-1 truncate">
                                  {line.tokens.map((tok, i) => (
                                    <span key={i} className={tok.color}>
                                      {tok.text}
                                    </span>
                                  ))}
                                  {line.num === streamIndex && streamIndex < currentProject.codeLines.length && (
                                    <span className="inline-block w-1.5 h-3 ml-1 bg-blue-400 align-middle animate-pulse" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Code Block Footer: Clean Build Telemetry (No AI-style green pill box) */}
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-t border-[#333333] text-[9.5px] text-[#858585] font-mono select-none">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Terminal className="w-3 h-3 text-slate-500" />
                              <span>Topic: {currentProject.topic}</span>
                            </span>
                            {streamIndex >= currentProject.codeLines.length && (
                              <span className="text-slate-400 font-mono text-[9px] sm:text-[9.5px]">
                                Compiled in 0.82s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Chat Input Bar */}
                <div
                  className={`p-2 rounded-xl bg-[#252526] border transition-all duration-300 flex items-center justify-between shrink-0 ${phase === "prompt_typing"
                    ? "border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30"
                    : "border-[#333333]"
                    }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 pl-1.5 pr-2">
                    {phase === "prompt_typing" ? (
                      <div className="flex items-center truncate text-[10.5px] text-white font-sans">
                        <span className="truncate">{typedPrompt}</span>
                        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-blue-400 align-middle animate-pulse shrink-0" />
                      </div>
                    ) : phase === "prompt_moving_up" ? (
                      <span className="text-[#858585] text-[10px] italic">Sending prompt to engine...</span>
                    ) : (
                      <span className="text-[#858585] text-[10px] truncate">
                        Ask Code2Live to generate microservices or full-stack apps...
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${phase === "prompt_typing"
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : phase === "prompt_moving_up"
                        ? "bg-blue-500 text-white scale-95"
                        : "bg-[#2d2d2d] text-[#858585] border border-[#3c3c3c]"
                      }`}
                  >
                    <Send className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: Live App Sandbox (Pure White / Light Theme)   */}
        {/* ========================================================= */}
        <div
          className={`${mobileView === "preview" ? "flex" : "hidden"
            } md:flex md:col-span-6 flex-col bg-[#F8FAFC] p-3 text-slate-800 justify-between min-h-0`}
        >
          {/* Sandbox Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 shrink-0 gap-2">
            <span className="text-xs font-semibold tracking-tight text-slate-900 truncate">
              <span className="hidden sm:inline">Live Application </span>Preview
            </span>

            {/* View Switcher Tabs */}
            <div className="flex gap-1 bg-slate-200/70 p-0.5 rounded-lg border border-slate-200 text-[10px] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("app")}
                className={`px-2 sm:px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${activeTab === "app"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <span className="hidden sm:inline">App </span>Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("telemetry")}
                className={`px-2 sm:px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${activeTab === "telemetry"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Telemetry
              </button>
            </div>
          </div>

          {/* Sandbox Content Area */}
          <div className="flex-1 py-2 flex flex-col justify-center min-h-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "app" ? (
                phase === "ide_view" ||
                  phase === "cursor_moving" ||
                  phase === "typing_mvn" ||
                  phase === "booting_spring" ||
                  phase === "prompt_typing" ||
                  phase === "prompt_moving_up" ? (
                  <motion.div
                    key="pre-generation-standby"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-3.5 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Background blueprint decorative subtle grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                    {/* Standby Header Strip */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">Sandbox Environment</div>
                          <div className="text-[9.5px] text-slate-400 font-mono">Live Web Preview Engine</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>
                          {phase === "ide_view" && "System Standby"}
                          {phase === "cursor_moving" && "Terminal Routing"}
                          {phase === "typing_mvn" && "Maven Executing"}
                          {phase === "booting_spring" && "Booting OpenJDK 21"}
                          {phase === "prompt_typing" && "Awaiting Requirement"}
                          {phase === "prompt_moving_up" && "Triggering Pipeline"}
                        </span>
                      </div>
                    </div>

                    {/* Center Ambient Orchestration Animation */}
                    <div className="flex-1 flex flex-col items-center justify-center py-4 text-center relative z-10">
                      {/* Ambient Radial Gradient Halo */}
                      <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />

                      {/* Center Icon Orb */}
                      <div className="relative mb-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/90 border border-slate-200/90 shadow-sm flex items-center justify-center">
                          {phase === "booting_spring" ? (
                            <Cpu className="w-6 h-6 text-emerald-600 animate-spin" style={{ animationDuration: "5s" }} />
                          ) : phase === "prompt_typing" || phase === "prompt_moving_up" ? (
                            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                          ) : (
                            <Activity className="w-6 h-6 text-slate-500" />
                          )}
                        </div>
                      </div>

                      {/* Status Headlines */}
                      <div className="text-xs font-semibold text-slate-900 tracking-tight">
                        {phase === "prompt_typing" || phase === "prompt_moving_up"
                          ? "Awaiting Natural Language Requirement"
                          : phase === "booting_spring"
                            ? "Spinning Up Spring Boot Multi-Agent Pipeline"
                            : "Workstation Standby • Ready to Build"}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-sans max-w-[280px] mt-1 leading-relaxed">
                        {phase === "prompt_typing"
                          ? "Submit architectural prompt to stream full-stack Spring Boot code and hot-reload live preview."
                          : phase === "booting_spring"
                            ? "Connecting to Apache Kafka broker topic codegen.req and initializing OpenJDK 21 LTS."
                            : "Execute ./mvnw spring-boot:run to activate multi-agent autonomous engineering pipeline."}
                      </div>

                      {/* Animated Subtle Progress Bar for Prompting/Booting */}
                      <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden border border-slate-200/60">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                          initial={{ width: "20%" }}
                          animate={
                            phase === "prompt_typing"
                              ? { width: "70%" }
                              : phase === "prompt_moving_up"
                                ? { width: "95%" }
                                : phase === "booting_spring"
                                  ? { width: "45%" }
                                  : { width: "15%" }
                          }
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Bottom Telemetry Strip */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[9.5px] font-mono text-slate-500 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">PIPELINE:</span>
                        <span className="text-slate-700 font-medium">EVENT-DRIVEN</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span>KAFKA: READY</span>
                        <span className="text-emerald-600 font-semibold">HOT-RELOAD</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${currentProject.id}-live`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-2.5 h-full justify-between"
                  >
                    {/* PROJECT 1: SNAKE & LADDER MULTIPLAYER PREVIEW */}
                    {currentProject.id === "snake_ladder" && (
                      <div className="flex-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-2.5 sm:p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 sm:pb-2 gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                              <Dice5 className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-900 truncate">Snake &amp; Ladder Multiplayer</div>
                              <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-mono truncate">Live WebSocket Session #842</div>
                            </div>
                          </div>
                          <span className="text-[9.5px] sm:text-[10.5px] font-mono font-medium text-emerald-700 shrink-0 truncate max-w-[150px] sm:max-w-none text-right">
                            {gameMessage}
                          </span>
                        </div>

                        {/* Interactive 5x4 Grid Board */}
                        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 py-1.5 sm:py-2">
                          {[100, 99, 98, 97, 96, 75, 76, 77, 78, 81, 52, 51, 50, 49, 42, 10, 16, 21, 25, 30].map(
                            (cell) => {
                              const isPlayerHere = cell === playerPosition;
                              const isSnake = cell === 99 || cell === 75 || cell === 52;
                              const isLadder = cell === 42 || cell === 21 || cell === 81;
                              return (
                                <div
                                  key={cell}
                                  className={`h-6 sm:h-7 rounded-md border flex items-center justify-between px-1 text-[8.5px] sm:text-[9.5px] font-mono transition-all duration-300 ${isPlayerHere
                                    ? "bg-blue-600 text-white font-bold border-blue-600 shadow-sm scale-105"
                                    : isSnake
                                      ? "bg-red-50 text-red-600 border-red-200 font-medium"
                                      : isLadder
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                                        : "bg-slate-50 text-slate-600 border-slate-200/70"
                                    }`}
                                >
                                  <span>{cell}</span>
                                  {isPlayerHere && <span className="text-[7.5px] sm:text-[8px] bg-white text-blue-600 rounded px-0.5 sm:px-1">YOU</span>}
                                  {isSnake && !isPlayerHere && <span className="text-[7.5px] sm:text-[8px]">🐍</span>}
                                  {isLadder && !isPlayerHere && <span className="text-[7.5px] sm:text-[8px]">🪜</span>}
                                </div>
                              );
                            }
                          )}
                        </div>

                        {/* Live Players & Dice Action Strip */}
                        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-slate-100 text-[9.5px] sm:text-[10.5px]">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600" />
                              <span className="font-medium text-slate-800">
                                <span className="hidden sm:inline">Player 1 </span>(Adarsh)
                              </span>
                              <span className="text-slate-400 font-mono text-[8.5px] sm:text-[9.5px]">Cell {playerPosition}</span>
                            </div>
                            <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 text-slate-400 shrink-0">
                              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300" />
                              <span>AI</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Roll:</span>
                            <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold font-mono flex items-center justify-center text-[10px] sm:text-xs shadow-2xs">
                              {diceValue}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PROJECT 2: REAL-TIME COLLABORATIVE KANBAN PREVIEW */}
                    {currentProject.id === "kanban_board" && (
                      <div className="flex-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                              <Kanban className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-900">Collaborative Kanban</div>
                              <div className="text-[9.5px] text-slate-400 font-mono">Kafka Event Stream #412</div>
                            </div>
                          </div>
                          <span className="text-[9.5px] sm:text-[10px] font-mono font-medium text-slate-500">
                            {kanbanStage === 0 && "Task #104 moved to 'In Progress'"}
                            {kanbanStage === 1 && "Task #102 deployed to 'Done'"}
                            {kanbanStage === 2 && "Synchronized with 12 WebSocket clients"}
                          </span>
                        </div>

                        {/* Kanban Columns */}
                        <div className="grid grid-cols-3 gap-2 py-2">
                          {/* Column 1: Backlog */}
                          <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-2 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-500 px-0.5">
                              <span className="font-semibold text-slate-700">To Do</span>
                              <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-[8.5px] font-semibold">
                                1
                              </span>
                            </div>
                            <div className="p-2 rounded-md bg-white border border-slate-200/90 shadow-2xs text-[10px]">
                              <span className="text-slate-800 font-medium block truncate">
                                OAuth 2.0 PKCE Auth
                              </span>
                              <span className="text-[9px] text-purple-600 font-mono mt-0.5 block font-medium">JWT • RS256</span>
                            </div>
                          </div>

                          {/* Column 2: In Progress */}
                          <div className="rounded-lg bg-blue-50/50 border border-blue-200/80 p-2 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[9.5px] font-mono text-blue-700 px-0.5">
                              <span className="font-semibold">In Progress</span>
                              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8.5px] font-semibold shadow-2xs">
                                1
                              </span>
                            </div>
                            <div className="p-2 rounded-md bg-white border border-blue-200 shadow-2xs text-[10px]">
                              <span className="text-slate-900 font-semibold block truncate">
                                AST Stream Synthesis
                              </span>
                              <div className="flex items-center justify-between mt-1 text-[8.5px] font-mono text-blue-600">
                                <span>Kafka Bus</span>
                                <span className="font-semibold">Active</span>
                              </div>
                            </div>
                          </div>

                          {/* Column 3: Done */}
                          <div className="rounded-lg bg-emerald-50/40 border border-emerald-200/80 p-2 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[9.5px] font-mono text-emerald-700 px-0.5">
                              <span className="font-semibold">Done</span>
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8.5px] font-semibold shadow-2xs">
                                2
                              </span>
                            </div>
                            <div className="p-2 rounded-md bg-white border border-emerald-200/80 shadow-2xs text-[10px]">
                              <span className="text-slate-800 font-medium block truncate">
                                Container Sandbox
                              </span>
                              <span className="text-[9px] text-emerald-600 font-mono mt-0.5 block font-medium">gVisor Isolated</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Footer info */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                          <span>Board: code2live-production</span>
                          <span className="text-blue-600 font-medium">Real-Time Sync: Online</span>
                        </div>
                      </div>
                    )}

                    {/* Real-Time Live Activity Feed Strip */}
                    <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs text-[9.5px] sm:text-[10.5px] font-mono">
                      <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                        <Radio className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="text-slate-700 truncate">
                          WebSocket: AST pipeline streaming active
                        </span>
                      </div>
                      <span className="text-emerald-700 font-semibold shrink-0 ml-1">12 Clients</span>
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="telemetry"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-2 gap-2 sm:gap-2.5 h-full content-center"
                >
                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>WebSocket Clients</span>
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 font-mono">
                      12 Connected
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] text-emerald-600 font-mono block mt-0.5 font-medium">
                      0 dropped frames
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>AST Latency</span>
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-blue-600 font-mono">18ms</span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono block mt-0.5 truncate">
                      p99: 22ms synthesis
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>Kafka Throughput</span>
                      <Cpu className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 font-mono">
                      4,800 evt/s
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono block mt-0.5 truncate">
                      codegen.req part 0
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>Container Runtime</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-emerald-600 font-mono">
                      Isolated
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono block mt-0.5">
                      Zero-Trust gVisor
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
