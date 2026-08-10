"use client";

import { FormInput } from "@/components/ui";

interface DateRangeFieldsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  startLabel?: string;
  endLabel?: string;
}

export default function DateRangeFields({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = "Check-in",
  endLabel = "Check-out",
}: DateRangeFieldsProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-2 gap-3">
      <FormInput
        label={startLabel}
        type="date"
        min={today}
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
      />
      <FormInput
        label={endLabel}
        type="date"
        min={startDate || today}
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
      />
    </div>
  );
}
