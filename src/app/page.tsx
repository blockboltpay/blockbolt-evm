"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Dashboard from "@/components/components/Dashboard";
import CreateScreen from "@/components/components/CreateScreen";
import SendTx from "@/components/components/SendTx";
import SuccessModal from "@/components/components/Success";

export default function Home() {
  const [localMnemonic, setLocalMnemonic] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mnemonic = localStorage.getItem("wallet:mnemonic");
      setLocalMnemonic(mnemonic);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      {!!localMnemonic ? <Dashboard /> : <CreateScreen />}
      {/* {<SendTx />} */}
      {/* <SuccessModal /> */}
    </main>
  );
}
