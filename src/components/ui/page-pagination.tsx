import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PagePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

/** Returns the list of page numbers + ellipsis markers to render. */
function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export function PagePagination({ page, totalPages, onPageChange }: PagePaginationProps) {
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = getPageRange(page, totalPages);

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => go(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
            href="#"
          />
        </PaginationItem>

        {pages.map((p, i) =>
          p === "…" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => { e.preventDefault(); go(p as number); }}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => go(page + 1)}
            className={page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
            href="#"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
