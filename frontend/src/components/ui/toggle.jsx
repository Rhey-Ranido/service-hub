import * as React from "react"
import { cn } from "@/lib/utils"

const Toggle = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
Toggle.displayName = "Toggle"

const ToggleItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
  <Toggle
    ref={ref}
    className={cn(
      "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
      className
    )}
    value={value}
    {...props}
  >
    {children}
  </Toggle>
))

ToggleItem.displayName = "ToggleItem"

export { Toggle, ToggleItem } 