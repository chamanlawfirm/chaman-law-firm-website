import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import type { BlogPost } from "@/lib/types";

type BlogArticleGridProps = {
  eyebrow: string;
  title: string;
  posts: BlogPost[];
  emptyText?: string;
};

export function BlogArticleGrid({ eyebrow, title, posts, emptyText = "More articles will appear here soon." }: BlogArticleGridProps) {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{eyebrow}</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-ivory">{title}</h2>
        </div>
        <Link href="/blog" className="text-sm font-bold text-royalGold hover:text-champagne">
          View All Articles
        </Link>
      </div>
      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6 text-sm leading-7 text-ivory/68">{emptyText}</div>
      )}
    </section>
  );
}
