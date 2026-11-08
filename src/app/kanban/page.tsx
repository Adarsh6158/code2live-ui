import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "Kanban Project Management — FlowBoard | Code2Live",
  description:
    "Experience FlowBoard: a modern Kanban project management application generated with Code2Live.",
};

export default function KanbanPage() {
  return <Home initialApp="flowboard" />;
}

