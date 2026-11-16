import type { ReactNode } from "react";
import { Web3Provider } from "@/components/Web3Provider";

export default function WalletLayout({ children }: { children: ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}
