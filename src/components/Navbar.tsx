"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Users, User, Search, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import MaintenanceToggle from "./MaintenanceToggle";
import SignOutConfirmationDialog from "./SignOutConfirmationDialog";

export default function Navbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsProfileDropdownOpen(false);
      setShowSignOutConfirmation(false);
      router.push("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      <nav className="bg-paper/90 backdrop-blur-xl border-b border-ink/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group block" aria-label="Synesis home">
              <Image
                src="/logo.png"
                alt="Synesis"
                width={250}
                height={100}
                priority
                className="h-10 w-auto transition-transform group-hover:-translate-y-0.5 md:h-11"
              />
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700"
                onClick={() => setShowSignOutConfirmation(true)}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <>
                <Link href="/login" className="px-2 py-2 font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-ink-soft">Sign in</Link>
                <Button asChild size="sm" className="px-3 font-mono text-[10px] uppercase tracking-[.12em]">
                  <Link href="/signup">Join</Link>
                </Button>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // Authenticated user navigation
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-ink-soft hover:text-purple-700 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/groups"
                  className="flex items-center space-x-2 text-ink-soft hover:text-purple-700 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span>Browse Groups</span>
                </Link>

                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex cursor-pointer items-center space-x-2 px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-purple-700"
                  >
                    <div className="w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {getUserInitials()}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-paper rounded-[3px] shadow-[4px_4px_0_0_rgba(36,26,53,0.12)] border border-ink/15 py-1 z-50">
                      <div className="px-4 py-2 border-b border-ink/10">
                        <p className="text-sm font-medium text-ink truncate">
                          {user?.user_metadata?.name || user?.email}
                        </p>
                        <p className="text-xs text-ink-soft truncate">{user?.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Link>

                      <Link
                        href="/my-groups"
                        className="flex items-center px-4 py-2 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Users className="h-4 w-4 mr-3" />
                        My Groups
                      </Link>

                      <div className="border-t border-ink/10 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setShowSignOutConfirmation(true);
                          }}
                          className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-100/50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Non-authenticated user navigation
              <>
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-ink-soft hover:text-purple-700 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors"
                >
                  <span>Home</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-ink-soft hover:text-purple-700 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors"
                >
                  <span>Sign In</span>
                </Link>
                <Button
                  size="lg"
                  variant="primary"
                  asChild
                  className="rounded-sm bg-purple-700 shadow-[2px_2px_0_0_#241a35] transition-all hover:translate-x-px hover:translate-y-px hover:bg-purple-800 hover:shadow-[1px_1px_0_0_#241a35]"
                >
                  <Link
                    href="/signup"
                    className="flex items-center px-5 py-2 text-sm font-semibold ml-2"
                  >
                    <span>Get Started</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
      </nav>
      <SignOutConfirmationDialog
        open={showSignOutConfirmation}
        onOpenChange={setShowSignOutConfirmation}
        onConfirm={handleSignOut}
        isSigningOut={isSigningOut}
      />
    </>
  );
}
