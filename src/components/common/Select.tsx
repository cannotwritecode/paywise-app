// components/common/Select.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, error, className, children, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label-field">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={cn(
            // 1. USE OUR INPUT FIELD STYLE!
            "input-field",
            // 2. Remove default OS appearance
            "appearance-none",
            // 3. Make room for the new icon
            "pr-10",
            error && "input-field-error",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {/* 4. Add our own styled chevron */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
          <ChevronDown size={20} />
        </span>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
