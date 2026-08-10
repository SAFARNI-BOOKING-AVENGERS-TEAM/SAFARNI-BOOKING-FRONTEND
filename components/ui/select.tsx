"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Styled to match FormInput exactly (same border/focus-ring treatment) so a
 * form mixing text inputs and dropdowns — e.g. car type, tour difficulty,
 * package type — looks like one cohesive form.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full appearance-none px-3 py-2.5 pr-9 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors",
              error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
