import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "Food Delivery App — BiteCraft | Code2Live",
  description:
    "Experience BiteCraft: a modern food delivery application generated with Code2Live.",
};

export default function FoodPage() {
  return <Home initialApp="bitecraft" />;
}

