type PaginationProps = {
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
  label?: string;
};

export const Pagination = ({
  page,
  pageCount,
  setPage,
  label = "Items",
}: PaginationProps) =>
  pageCount <= 1 ? null : (
    <nav
      aria-label={`${label} pages`}
      className="flex items-center justify-center gap-4 py-4"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="min-h-11 rounded border border-neutral-700 px-4 disabled:opacity-40"
      >
        Previous
      </button>
      <span aria-live="polite">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => setPage(page + 1)}
        className="min-h-11 rounded border border-neutral-700 px-4 disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
