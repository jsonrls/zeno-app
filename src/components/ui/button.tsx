import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm border text-sm font-semibold tracking-[-0.01em] outline-none transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-purple-700/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-purple-700 bg-purple-700 text-white hover:border-purple-800 hover:bg-purple-800",
        primary:
          "border-purple-700 bg-purple-700 text-white hover:border-purple-800 hover:bg-purple-800",
        destructive:
          "border-red-700 bg-red-700 text-white hover:border-red-800 hover:bg-red-800 focus-visible:ring-red-700/25",
        outline:
          "border-ink/35 bg-[#fffcf5] text-ink hover:border-ink hover:bg-paper-deep",
        secondary:
          "border-paper-deep bg-paper-deep text-ink hover:border-ink/25 hover:bg-[#e9dfcb]",
        ghost:
          "border-transparent bg-transparent text-ink-soft hover:border-ink/20 hover:bg-paper-deep hover:text-ink",
        link: "border-transparent bg-transparent text-purple-700 underline-offset-4 hover:underline",
        custom: "border-purple-300 bg-[#fffcf5] text-purple-700 hover:border-purple-500 hover:bg-purple-50",
      },
      size: {
        default: "h-8 px-3.5 text-sm has-[>svg]:px-3",
        sm: "h-7 gap-1 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-9 px-4 text-sm has-[>svg]:px-3.5",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
