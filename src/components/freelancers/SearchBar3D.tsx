import { Search, X, LayoutGrid, List, Users } from "lucide-react";
import { memo } from "react";

interface SearchBar3DProps {
  search: string;
  setSearch: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  resultsCount: number;
}

const SearchBar3D = memo(({
  search,
  setSearch,
  viewMode,
  setViewMode,
  resultsCount,
}: SearchBar3DProps) => {
  return (
    <div className="mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-border p-4 mb-4">
          {/* Search + View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom, spécialité..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={14} className="text-primary" />
          <span>
            <strong className="text-foreground">{resultsCount}</strong>{" "}
            {resultsCount === 1 ? "talent trouvé" : "talents trouvés"}
          </span>
        </div>
      </div>
    </div>
  );
});

SearchBar3D.displayName = "SearchBar3D";

export default SearchBar3D;
