import type { ReactNode } from "react";

export const revalidate = 2592000;

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
