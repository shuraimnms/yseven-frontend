import { cn } from "@/lib/utils";
import { memo } from "react";
import logoImage from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  alt?: string;
  priority?: boolean;
}

const Logo = memo(({ className, size = "md", alt = "Y7 Premium Sauces", priority = false }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 lg:h-8",
    md: "h-8 lg:h-12", 
    lg: "h-12 lg:h-16",
    xl: "h-16 lg:h-20",
    "2xl": "h-20 lg:h-28",
    "3xl": "h-24 lg:h-32"
  };

  // Create props object with proper typing for fetchpriority
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> & { fetchpriority?: string } = {
    src: logoImage,
    alt,
    loading: priority ? "eager" : "lazy",
    decoding: "async",
    fetchpriority: priority ? "high" : "auto",
    className: cn(
      "w-auto object-contain transition-transform duration-200 will-change-transform",
      "hover:scale-105 active:scale-95",
      sizeClasses[size],
      className
    )
  };

  return <img {...imgProps} />;
});

Logo.displayName = "Logo";

export default Logo;