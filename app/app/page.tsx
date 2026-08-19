import type { Metadata } from "next";
import { TangladWorkspace } from "@/components/tanglad-workspace";

export const metadata: Metadata = {
  title: "Workspace | Tanglad",
  description: "Plan work, understand task weight, and keep your team balanced.",
};

export default function WorkspacePage() {
  return <TangladWorkspace />;
}
