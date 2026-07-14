"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { Button } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn(
        "group/calendar w-[min(24rem,calc(100vw-2rem))] max-w-none rounded-[3px] border border-ink/20 bg-[#fffcf5] p-3 text-ink shadow-[5px_5px_0_rgba(36,26,53,0.12)] sm:p-4 [--cell-size:2.55rem] sm:[--cell-size:2.8rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("relative flex w-full flex-col", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-2 sm:gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex h-11 items-center justify-between sm:h-[3.25rem]",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "grid size-8 place-items-center rounded-[2px] border border-ink/15 bg-paper p-0 text-purple-700 shadow-none transition-colors hover:border-purple-700/40 hover:bg-purple-100/60 hover:text-purple-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-35 sm:size-10",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "grid size-8 place-items-center rounded-[2px] border border-ink/15 bg-paper p-0 text-purple-700 shadow-none transition-colors hover:border-purple-700/40 hover:bg-purple-100/60 hover:text-purple-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-35 sm:size-10",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-11 items-center justify-center border-b border-ink/15 px-10 sm:h-[3.25rem] sm:px-12",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-full w-full items-center justify-center gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-[2px] border border-ink/15 bg-paper has-focus:border-purple-700 has-focus:ring-2 has-focus:ring-purple-700/15",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-serif text-xl font-medium tracking-[-0.02em] text-ink",
          captionLayout !== "label" && "flex items-center gap-1 px-2 text-sm",
          defaultClassNames.caption_label
        ),
        table: "w-full table-fixed border-collapse",
        weekdays: cn("flex border-b border-ink/10 pb-1.5", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none text-center font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size)", defaultClassNames.week_number_header),
        week_number: cn(
          "select-none font-mono text-[10px] text-ink-soft",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative flex flex-1 items-center justify-center p-0 text-center",
          defaultClassNames.day
        ),
        range_start: cn("bg-purple-100/70", defaultClassNames.range_start),
        range_middle: cn("bg-purple-100/55", defaultClassNames.range_middle),
        range_end: cn("bg-purple-100/70", defaultClassNames.range_end),
        today: cn("font-semibold text-purple-800", defaultClassNames.today),
        outside: cn("text-ink-soft/30", defaultClassNames.outside),
        disabled: cn("text-ink-soft/30", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...rootProps}
          />
        ),
        Chevron: ({ className, orientation, ...chevronProps }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...chevronProps} />
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...chevronProps} />
          }

          return <ChevronDownIcon className={cn("size-3.5", className)} {...chevronProps} />
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-today={modifiers.today}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        defaultClassNames.day,
        className,
        "grid size-[2.55rem] min-w-0 place-items-center rounded-[2px] border border-transparent p-0 font-sans text-[0.95rem] font-medium leading-none text-ink transition-[background-color,border-color,color,transform] duration-150 hover:-translate-y-px hover:border-purple-700/30 hover:bg-purple-100/60 hover:text-purple-900 focus-visible:border-purple-700 focus-visible:ring-2 focus-visible:ring-purple-700/25 data-[today=true]:border-purple-700/35 data-[today=true]:text-purple-800 data-[selected-single=true]:border-purple-700 data-[selected-single=true]:bg-purple-700 data-[selected-single=true]:font-semibold data-[selected-single=true]:text-white data-[selected-single=true]:shadow-[2px_2px_0_#241a35] data-[range-start=true]:border-purple-700 data-[range-start=true]:bg-purple-700 data-[range-start=true]:text-white data-[range-end=true]:border-purple-700 data-[range-end=true]:bg-purple-700 data-[range-end=true]:text-white data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-purple-100/70 data-[range-middle=true]:text-purple-900 disabled:cursor-not-allowed disabled:text-ink-soft/30 disabled:hover:translate-y-0 disabled:hover:border-transparent disabled:hover:bg-transparent sm:size-[2.8rem] sm:text-base"
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
