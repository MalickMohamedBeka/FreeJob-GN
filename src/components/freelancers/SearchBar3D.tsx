import { motion, AnimatePresence } from "framer-motion";
import { Search, X, LayoutGrid, List, Users } from "lucide-react";
import { useState, memo } from "react";

interface SearchBar3DProps {
  search: string;
  setSearch: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  filters: string[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  resultsCount: number;
}

const SearchBar3D = memo(({ 
  search, 
  setSearch, 
  activeFilter, 
  setActiveFilter, 
  filters,
  viewMode,
  setViewMode,
  resultsCount
}: SearchBar3DProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-12">
      {/* Search Bar - Clean Design */}
      <div className="max-w-5xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-2xl border border-white/30 shadow-elevation-3 p-6"
        >
          {/* Search Input Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, compétence ou spécialité..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {search && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-muted rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list" 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Filters Row - Horizontal Scroll */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
              Compétences :
            </span>
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              
              return (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-background border border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {filter}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Results Count - Clean Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-5 py-2.5 shadow-sm">
          <Users size={18} className="text-primary" />
          <span className="text-sm">
            <span className="font-bold text-foreground">{resultsCount}</span>
            <span className="text-muted-foreground ml-1">
              {resultsCount === 1 ? "talent trouvé" : "talents trouvés"}
            </span>
          </span>
          {activeFilter !== "Tous" && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Filtré par <span className="font-semibold text-primary">{activeFilter}</span>
              </span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
});

SearchBar3D.displayName = 'SearchBar3D';

export default SearchBar3D;
