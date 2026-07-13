"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Users, Plus, User, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requireAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Home",
    requireAuth: true,
  },
  {
    href: "/groups",
    icon: Search,
    label: "Browse",
    requireAuth: true,
  },
  {
    href: "/create-group",
    icon: Plus,
    label: "Create",
    requireAuth: true,
  },
  {
    href: "/my-groups",
    icon: Users,
    label: "My Groups",
    requireAuth: true,
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
    requireAuth: true,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <nav aria-label="Mobile navigation" className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-xl border-t border-ink/15 z-50">
      <div className="flex items-end justify-around px-2 pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors duration-200 ${item.href === "/create-group" ? "mobile-nav-create" : ""} ${
                isActive
                  ? "text-purple-700"
                  : "text-ink-soft hover:text-purple-700"
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`h-[22px] w-[22px] ${
                    isActive ? "text-purple-700" : "text-ink-soft"
                  }`} 
                />
                {isActive && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rotate-45 bg-purple-700" />}
              </div>
              <span 
                className={`mt-1 font-mono text-[10px] uppercase tracking-[0.08em] truncate ${
                  isActive ? "text-purple-700" : "text-ink-soft"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-paper"></div>
    </nav>
  );
}
