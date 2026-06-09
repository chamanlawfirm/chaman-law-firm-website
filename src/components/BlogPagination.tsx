import Link from "next/link";

type BlogPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  search?: string;
};

function pageHref(basePath: string, page: number, search?: string) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function BlogPagination({ basePath, currentPage, totalPages, search }: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-royalGold/12 pt-6" aria-label="Blog pagination">
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, currentPage - 1, search)}
          className="rounded-full border border-royalGold/30 px-4 py-2 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-full border border-royalGold/10 px-4 py-2 text-sm font-bold text-ivory/32">Previous</span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(basePath, page, search)}
          aria-current={page === currentPage ? "page" : undefined}
          className={
            page === currentPage
              ? "rounded-full bg-royalGold px-4 py-2 text-sm font-bold text-luxuryBlack"
              : "rounded-full border border-royalGold/25 px-4 py-2 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
          }
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, currentPage + 1, search)}
          className="rounded-full border border-royalGold/30 px-4 py-2 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-full border border-royalGold/10 px-4 py-2 text-sm font-bold text-ivory/32">Next</span>
      )}
    </nav>
  );
}
