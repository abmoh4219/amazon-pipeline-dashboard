"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

type HeaderProps = {
  onFilterClick?: () => void;
};

export function Header({ onFilterClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Overview";
    if (pathname.startsWith("/products")) return "Products";
    return "Amazon Dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
      <div className="flex h-16 items-center px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center space-x-2">
          {onFilterClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={onFilterClick}
            >
              <Filter className="h-5 w-5" />
              <span className="sr-only">Filters</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
