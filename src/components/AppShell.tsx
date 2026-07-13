"use client";

import { useAuth } from "@/lib/auth";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import InstallPrompt from "./InstallPrompt";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className={`min-h-screen flex flex-col ${user ? "has-bottom-nav" : ""}`}>
      <Navbar />
      <main className={`app-canvas flex-1 ${user ? "pb-[5.5rem] md:pb-0" : "pb-0"}`}>
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <InstallPrompt />
    </div>
  );
}
