import { Search, X, SlidersHorizontal } from "lucide-react";

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
  filters,
}: FilterBar3DProps) => {
  return (
    <div className="mb-10">
      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 justify-center flex-wrap">
        <SlidersHorizontal size={16} className="text-muted-foreground" />
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {activeFilter !== "Tous" && (
        <p className="text-center mt-4 text-sm text-muted-foreground">
          Filtré par: <span className="text-primary font-semibold">{activeFilter}</span>
        </p>
      )}
    </div>
  );
};

export default FilterBar3D;
