import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, id, label, ...props }, ref) => (
    <div className="w-full space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/80"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive animate-slide-up">
          {error}
        </p>
      )}
    </div>
  )
);

Input.displayName = "Input";
