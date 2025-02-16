import type { Metadata } from "next";
import { Counter } from "./components/counter/Counter";

export default function IndexPage() {
  return <button className="border border-black">Info</button>;
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
