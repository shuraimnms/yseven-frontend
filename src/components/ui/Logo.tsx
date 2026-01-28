import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  alt?: string;
}

const Logo = ({ className, size = "md", alt = "Y7 Premium Sauces" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 lg:h-8",
    md: "h-8 lg:h-12", 
    lg: "h-12 lg:h-16",
    xl: "h-16 lg:h-20",
    "2xl": "h-20 lg:h-28",
    "3xl": "h-24 lg:h-32"
  };

  return (
    <img 
      src={logoImage} 
      alt={alt}
      className={cn(
        "w-auto object-contain transition-all duration-300 hover:scale-105",
        sizeClasses[size],
        className
      )}
    />
  );
};

export default Logo;