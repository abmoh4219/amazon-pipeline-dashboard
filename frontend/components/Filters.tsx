"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types/product";

type FiltersProps = {
  open: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function Filters({
  open,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
}: FiltersProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-xl p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close filters</span>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-4rem)] pr-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Search</h3>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                <div
                  onClick={() => onCategorySelect(null)}
                  className="cursor-pointer"
                >
                  <Badge
                    variant={selectedCategory === null ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    All Categories
                  </Badge>
                </div>
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => onCategorySelect(category)}
                    className="cursor-pointer"
                  >
                    <Badge
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      {category}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
