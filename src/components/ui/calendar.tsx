"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import "./calendar.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="calendar-wrapper">
      <style jsx global>{`
        /* Extra aggressive direct selectors */
        body .rdp-months .rdp-month .rdp-table thead tr {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          width: 100% !important;
          gap: 0 !important;
        }

        body .rdp-months .rdp-month .rdp-table thead tr th {
          width: auto !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 4px 0 !important;
        }

        body .rdp-months .rdp-month .rdp-table thead tr th abbr {
          text-decoration: none !important;
          width: 24px !important;
          display: inline-block !important;
          text-align: center !important;
          letter-spacing: normal !important;
          word-spacing: normal !important;
        }

        /* Fixed day spacing */
        body .rdp-months .rdp-month .rdp-table thead tr th:nth-child(1) abbr {
          content: "Su" !important;
        }
        body .rdp-months .rdp-month .rdp-table thead tr th:nth-child(2) abbr {
          content: "Mo" !important;
        }
        body .rdp-months .rdp-month .rdp-table thead tr th:nth-child(3) abbr {
          content: "Tu" !important;
        }
        body .rdp-months .rdp-month .rdp-table thead tr th:nth-child(4) abbr {
          content: "We" !important;
        }
        body .rdp-months .rdp-month .rdp-table thead tr th:nth-child(5) abbr {
          content: "Th" !important;
        }
        body .rdp-months .rdp-month .rdp-table thead tr th:nth-child(6) abbr {
          content: "Fr" !important;
        }
        body .rdp-months .rdp-month .rdp-table thead tr th:nth-child(7) abbr {
          content: "Sa" !important;
        }

        /* Calendar grid rows */
        body .rdp-months .rdp-month .rdp-table tbody tr {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          width: 100% !important;
          gap: 0 !important;
        }
      `}</style>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "day-header-row",
          head_cell: "day-header-cell",
          row: "day-row",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          Chevron({ ...props }) {
            return props.orientation === "left" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            );
          },
          ...props.components,
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
