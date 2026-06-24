import Link from "next/link";
import { Search } from "lucide-react";
import { LeadMagnetDownloads } from "@/components/LeadMagnetDownloads";
import { siteConfig } from "@/lib/constants";
import type { BlogAuthor, BlogCategory, BlogPost, BlogTag } from "@/lib/types";
import { formatDate, whatsappLink } from "@/lib/utils";

type BlogSidebarProps = {
  categories: BlogCategory[];
  tags?: BlogTag[];
  authors?: BlogAuthor[];
  recentPosts: BlogPost[];
  popularPosts: BlogPost[];
  search?: string;
};

function SidebarPostList({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) {
    return <p className="text-sm leading-7 text-ivory/60">Published articles will appear here soon.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post.slug} href={`/resources/blog/${post.slug}`} className="block border-b border-royalGold/10 pb-4 last:border-0 last:pb-0">
          <p className="font-heading text-base font-semibold leading-snug text-ivory hover:text-royalGold">{post.title}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-royalGold/80">{formatDate(post.date)}</p>
        </Link>
      ))}
    </div>
  );
}

export function BlogSidebar({ categories, tags = [], authors = [], recentPosts, popularPosts, search = "" }: BlogSidebarProps) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
        <h2 className="font-heading text-lg font-semibold text-ivory">Search Articles</h2>
        <form action="/resources/blog" method="get" className="mt-4 flex overflow-hidden rounded-full border border-royalGold/20 bg-luxuryBlack">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search legal topics"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40"
          />
          <button type="submit" aria-label="Search articles" className="bg-royalGold px-4 text-luxuryBlack transition hover:bg-champagne">
            <Search size={18} />
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
        <h2 className="font-heading text-lg font-semibold text-ivory">Categories</h2>
        <div className="mt-4 space-y-2">
          {categories.length ? (
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/resources/blog?category=${category.slug}`}
                className="flex items-center justify-between gap-3 rounded-md border border-royalGold/10 px-3 py-2 text-sm text-ivory/72 transition hover:border-royalGold/35 hover:text-royalGold"
              >
                <span>{category.title}</span>
                <span className="text-xs text-ivory/48">{category.postCount}</span>
              </Link>
            ))
          ) : (
            <p className="text-sm leading-7 text-ivory/60">Categories will appear after posts are published.</p>
          )}
        </div>
      </section>

      {tags.length ? (
        <section className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
          <h2 className="font-heading text-lg font-semibold text-ivory">Topic Tags</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 14).map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="rounded-full border border-royalGold/16 px-3 py-1 text-xs font-semibold text-ivory/58 transition hover:border-royalGold/40 hover:text-royalGold"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {authors.length ? (
        <section className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
          <h2 className="font-heading text-lg font-semibold text-ivory">Authors</h2>
          <div className="mt-4 space-y-2">
            {authors.slice(0, 6).map((author) => (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="flex items-center justify-between gap-3 rounded-md border border-royalGold/10 px-3 py-2 text-sm text-ivory/72 transition hover:border-royalGold/35 hover:text-royalGold"
              >
                <span>{author.name}</span>
                <span className="text-xs text-ivory/48">{author.postCount}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
        <h2 className="font-heading text-lg font-semibold text-ivory">Recent Posts</h2>
        <div className="mt-4">
          <SidebarPostList posts={recentPosts} />
        </div>
      </section>

      <section className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
        <h2 className="font-heading text-lg font-semibold text-ivory">Popular Posts</h2>
        <p className="mt-2 text-xs leading-6 text-ivory/52">High-interest reads from the Chaman Law Firm knowledge desk.</p>
        <div className="mt-4">
          <SidebarPostList posts={popularPosts} />
        </div>
      </section>

      <section className="rounded-lg border border-royalGold/25 bg-luxuryBlack p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Need Legal Guidance?</p>
        <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">Speak with Chaman Law Firm today.</h2>
        <p className="mt-3 text-sm leading-7 text-ivory/66">
          Get help with property law, business matters, disputes, debt recovery, probate, notary services, or diaspora legal support.
        </p>
        <a
          href={whatsappLink(`Hello ${siteConfig.name}, I need professional legal guidance.`)}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
        >
          WhatsApp Us
        </a>
      </section>

      <LeadMagnetDownloads source="Blog sidebar downloads" compact />
    </aside>
  );
}
