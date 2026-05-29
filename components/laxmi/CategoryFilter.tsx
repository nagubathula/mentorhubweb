"use client";

import { Category, CATEGORIES } from "@/lib/laxmi-data";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 py-4 items-center justify-center sm:justify-start w-full">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border",
            selectedCategory === category
              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
