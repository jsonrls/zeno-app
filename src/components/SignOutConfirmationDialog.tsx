"use client";

import { useEffect } from "react";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignOutConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSigningOut?: boolean;
}

export default function SignOutConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isSigningOut = false,
}: SignOutConfirmationDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSigningOut) onOpenChange(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSigningOut, onOpenChange, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-ink/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSigningOut) onOpenChange(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-out-dialog-title"
        className="relative w-full max-w-md border border-ink/25 bg-[#fffcf5] p-6 shadow-[7px_7px_0_#241a35] sm:p-7"
      >
        <button
          type="button"
          aria-label="Close sign out confirmation"
          disabled={isSigningOut}
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 cursor-pointer text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">
          End session
        </p>
        <h2 id="sign-out-dialog-title" className="font-serif text-3xl font-medium text-ink">
          Sign out of Zeno?
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
          You&apos;ll need to sign in again to manage your groups and profile.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSigningOut}
          >
            Stay signed in
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSigningOut}
          >
            <LogOut />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </section>
    </div>
  );
}
