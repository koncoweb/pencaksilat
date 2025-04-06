import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark";
  blur?: "sm" | "md" | "lg";
  border?: boolean;
  rounded?: "sm" | "md" | "lg" | "full" | "none";
  padding?: "sm" | "md" | "lg" | "none";
  shadow?: boolean;
}

const GlassContainer = ({
  children = (
    <div className="p-6 text-center text-gray-400">Container Content</div>
  ),
  className = "",
  variant = "primary",
  blur = "md",
  border = true,
  rounded = "lg",
  padding = "md",
  shadow = true,
}: GlassContainerProps) => {
  // Blur mapping
  const blurMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  // Rounded mapping
  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  // Padding mapping
  const paddingMap = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  // Variant mapping for background and text colors
  const variantMap = {
    primary: "bg-white/70 text-gray-900 dark:text-gray-100",
    secondary: "bg-white/50 text-gray-800 dark:text-gray-200",
    dark: "bg-gray-900/30 text-white",
  };

  return (
    <div
      className={cn(
        "relative bg-white", // Base background to ensure visibility in isolation
        variantMap[variant],
        blurMap[blur],
        roundedMap[rounded],
        paddingMap[padding],
        border && "border border-white/40",
        shadow && "shadow-lg",
        "transition-all duration-300 ease-in-out",
        "hover:bg-opacity-25",
        className,
      )}
      style={{
        backdropFilter: `blur(${blur === "sm" ? "4px" : blur === "md" ? "8px" : "16px"})`,
        WebkitBackdropFilter: `blur(${blur === "sm" ? "4px" : blur === "md" ? "8px" : "16px"})`,
      }}
    >
      {children}
    </div>
  );
};

export default GlassContainer;
