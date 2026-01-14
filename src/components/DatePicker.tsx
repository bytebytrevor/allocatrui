"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Props = {
    id: string;
    label?: string;
    value: Date | null
    onChange?: (date: Date | undefined) => void
    className?: string;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function Calendar28({id, label, value, onChange, className}: Props) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(value ?? undefined)

  const handleSelect = (date: Date | undefined) => {
      if (onChange) onChange(date)
        setMonth(date)
        setOpen(false)
  }

  const currentDate = new Date();

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} className="px-1 font-semibold">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={formatDate(value ?? undefined)}
          placeholder={currentDate.toLocaleDateString("en-US", {day: "2-digit", month: "long", year: "numeric"})}
          className={cn ("border-none pr-10", className)}
          onChange={(e) => {
            const date = new Date(e.target.value)
            if (!isNaN(date.getTime()) && onChange) {
              onChange(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value ?? undefined}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
