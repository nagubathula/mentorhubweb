"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, Category } from "@/lib/laxmi-data";
import { ProductCard } from "@/components/laxmi/ProductCard";
import { CategoryFilter } from "@/components/laxmi/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search, Monitor, Cpu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LaxmiCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header / Hero Section */}
        <header className="mb-16 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Hardware & Workstations</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-cyan-400">
              Laxmi Computers
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Elevate your digital experience. We provide top-tier hardware parts, custom workstation catalogs, and expert advice for enthusiasts and professionals.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-slate-700/50 flex items-center justify-center backdrop-blur-md shadow-xl shadow-cyan-900/20">
              <Cpu className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-slate-700/50 flex items-center justify-center backdrop-blur-md mt-6 shadow-xl shadow-blue-900/20">
              <Monitor className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-2xl sm:border sm:px-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />
            
            <div className="relative w-full md:w-72 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search hardware..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all rounded-full h-10"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="min-h-[50vh]">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
              <Monitor className="w-16 h-16 mb-4 text-slate-700" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">No products found</h3>
              <p>Try adjusting your search or category filter.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                className="mt-4 text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
