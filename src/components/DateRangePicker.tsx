"use client";
import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { CalenderIcon } from "@/icons/DashboardIcons";
import { ArrowDownIcon } from "@/icons/Icons";
import { cn } from "@/lib/utils";

import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  className?: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  onChange: (range: { from: string; to: string }) => void;
}

export function DateRangePicker({
  className,
  from,
  to,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Convert strings to Date objects for the picker
  const selected: DateRange | undefined = React.useMemo(() => {
    if (!from && !to) return undefined;

    // Parse the dates safely
    const fromDate = from ? parseISO(from) : undefined;
    const toDate = to ? parseISO(to) : undefined;

    // Only verify if dates are valid
    const isFromValid = fromDate ? isValid(fromDate) : true;
    const isToValid = toDate ? isValid(toDate) : true;

    if (!isFromValid || !isToValid) return undefined;

    return {
      from: fromDate,
      to: toDate,
    };
  }, [from, to]);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange({ from: "", to: "" });
      return;
    }
    const fromStr = range.from ? format(range.from, "yyyy-MM-dd") : "";
    const toStr = range.to ? format(range.to, "yyyy-MM-dd") : "";

    onChange({ from: fromStr, to: toStr });
  };

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayText = React.useMemo(() => {
    if (from && to) {
      if (from === to) return format(parseISO(from), "LLL dd, y");
      return `${format(parseISO(from), "LLL dd, y")} - ${format(parseISO(to), "LLL dd, y")}`;
    }
    if (from) {
      return format(parseISO(from), "LLL dd, y");
    }
    return "Pick a date range";
  }, [from, to]);

  const variants = {
    open: { opacity: 1, y: 0, scale: 1 },
    closed: { opacity: 0, y: -10, scale: 0.95 },
  };

  return (
    <div className={cn("relative sm:col-span-2", className)} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-3 py-2 border-[1px] bg-white border-gray-300 rounded-[4px] text-sm text-left flex justify-between items-center focus:outline-none focus:ring-[1px] focus:ring-[#538e53] font-montserrat transition-all duration-200",
          from || to ? "text-gray-900 border-[#538e53]" : "text-gray-500",
          isOpen && "ring-[1px] ring-[#538e53] border-[#538e53]",
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalenderIcon
            className={cn(
              "w-4 h-4",
              from || to ? "text-[#538e53]" : "text-gray-400",
            )}
          />
          <span className="truncate">{displayText}</span>
        </div>
        <ArrowDownIcon
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-auto min-w-[300px]"
          >
            <DayPicker
              mode="range"
              selected={selected}
              onSelect={handleSelect}
              numberOfMonths={1}
              pagedNavigation
              showOutsideDays
              modifiersClassNames={{
                selected: "bg-[#538e53] text-white hover:bg-[#538e53]/90",
                today: "text-[#538e53] font-bold",
                range_middle: "bg-[#538e53]/10 text-[#538e53] rounded-none",
                range_start: "bg-[#538e53] text-white rounded-l-md",
                range_end: "bg-[#538e53] text-white rounded-r-md",
              }}
              styles={{
                caption: { color: "#2B2B2B" },
                head_cell: { color: "#808080", fontWeight: 500 },
                day: { borderRadius: "4px" },
              }}
            />
            <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  onChange({ from: "", to: "" });
                  setIsOpen(false);
                }}
                className="text-xs text-gray-400 hover:text-[#b28362] px-2 py-1 rounded"
              >
                Clear Filter
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs bg-[#538e53] text-white px-3 py-1 rounded ml-2 hover:bg-[#467a46]"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
