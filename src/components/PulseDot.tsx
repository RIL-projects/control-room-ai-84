import { cn } from "@/lib/utils";

interface PulseDotProps {
  color: "success" | "warning" | "destructive" | "primary";
  size?: "sm" | "md";
}

export function PulseDot({ color, size = "sm" }: PulseDotProps) {
  const sizeClass = size === "sm" ? "w-2 h-2" : "w-3 h-3";
  const colorClass = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    primary: "bg-primary",
  }[color];

  return (
    <span className="relative flex items-center justify-center">
      <span className={cn("absolute rounded-full opacity-40 animate-ping", sizeClass, colorClass)} />
      <span className={cn("relative rounded-full", sizeClass, colorClass)} />
    </span>
  );
}
