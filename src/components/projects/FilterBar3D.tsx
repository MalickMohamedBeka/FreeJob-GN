import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterBar3DProps {
  search: string;
  setSearch: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  filters: string[];
}

const FilterBar3D = ({ 
  search, 
  setSearch, 
  activeFilter, 
  setActiveFilter, 
  filters 
}: FilterBar3DProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-12">
      {/* Search Bar with 3D Effect */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-2xl mx-auto mb-8"
      >
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 40px rgba(255, 122, 61, 0.3)"
              : "0 8px 24px rgba(0, 0, 0, 0.15)"
          }}
          transition={{ duration: 0.3 }}
          className="relative glass rounded-2xl border-2 border-white/30 overflow-hidden"
        >
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-hero opacity-0"
            animate={{ opacity: isFocused ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative flex items-center">
            <motion.div
              animate={{ 
                rotate: isFocused ? 360 : 0,
                scale: isFocused ? 1.2 : 1
              }}
              transition={{ duration: 0.5 }}
              className="absolute left-6"
            >
              <Search className="text-primary" size={24} />
            </motion.div>

            <input
              type="text"
              placeholder="Rechercher un projet incroyable..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-16 pl-16 pr-16 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg font-medium"
            />

            {search && (
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearch("")}
                className="absolute right-6 w-8 h-8 rounded-full glass-dark flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </motion.button>
            )}
          </div>

          {/* Bottom Glow */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-hero"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Floating Particles when focused */}
        {isFocused && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-hero"
                initial={{ 
                  x: 0, 
                  y: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                style={{
                  left: `${50 + (Math.random() - 0.5) * 20}%`,
                  top: "50%",
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Filter Pills with 3D Effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-3 justify-center flex-wrap"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="glass rounded-full p-3 shadow-elevation-2 border border-white/30"
        >
          <SlidersHorizontal size={20} className="text-primary" />
        </motion.div>

        {filters.map((filter, index) => {
          const isActive = activeFilter === filter;
          
          return (
            <motion.button
              key={filter}
              initial={{ opacity: 0, scale: 0, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.3 + index * 0.05,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                rotateZ: isActive ? 0 : 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                isActive
                  ? "text-white shadow-elevation-3"
                  : "glass text-muted-foreground hover:text-foreground shadow-elevation-1"
              }`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Active Background */}
              {isActive && (
                <>
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-hero rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-hero rounded-full blur-xl opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}

              <span className="relative z-10">{filter}</span>

              {/* 3D Badge for active */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-white shadow-elevation-2 flex items-center justify-center"
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Active Filter Count */}
      {activeFilter !== "Tous" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center mt-6"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block glass rounded-full px-4 py-2 text-sm font-medium shadow-elevation-1"
          >
            Filtré par: <span className="text-gradient-hero font-bold">{activeFilter}</span>
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default FilterBar3D;
