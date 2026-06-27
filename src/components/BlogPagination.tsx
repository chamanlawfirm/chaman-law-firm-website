import Link from "next/link";

type BlogPaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  search?: string;
  category?: string;
};

function pageHref(basePath: string, page: number, search?: string, category?: string) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (search) {
    params.set("search", search);
  }

  if (category) {
    params.set("category", category);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function paginationItems(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages]);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items: Array<number | string> = [];

  sortedPages.forEach((page, index) => {
    const previous = sortedPages[index - 1];

    if (previous && page - previous > 1) {
      items.push(`ellipsis-${previous}-${page}`);
    }

    items.push(page);
  });

  return items;
}

export function BlogPagination({ basePath, currentPage, totalPages, search, category }: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = paginationItems(currentPage, totalPages);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-royalGold/12 pt-6" aria-label="Blog pagination">
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, currentPage - 1, search, category)}
          className="rounded-full border border-royalGold/30 px-4 py-2 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-full border border-royalGold/10 px-4 py-2 text-sm font-bold text-ivory/32">Previous</span>
      )}

      {pages.map((page) =>
        typeof page === "number" ? (
          <Link
            key={page}
            href={pageHref(basePath, page, search, category)}
            aria-current={page === currentPage ? "page" : undefined}
            className={
              page === currentPage
                ? "rounded-full bg-royalGold px-4 py-2 text-sm font-bold text-luxuryBlack"
                : "rounded-full border border-royalGold/25 px-4 py-2 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
            }
          >
            {page}
          </Link>
        ) : (
          <span key={page} className="px-2 text-sm font-bold text-ivory/42" aria-hidden="true">
            ...
          </span>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, currentPage + 1, search, category)}
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
