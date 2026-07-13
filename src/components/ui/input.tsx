import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-ink placeholder:text-ink-soft/60 selection:bg-purple-700 selection:text-white border-1 flex h-9 w-full min-w-0 rounded-[3px] border-ink/25 bg-[#fffcf5] px-3 py-1 text-base text-ink shadow-xs transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-1 file:border-purple-700 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-ink/45 focus:border-purple-700 focus-visible:border-purple-700 focus-visible:ring-[3px] focus-visible:ring-purple-700/15",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
