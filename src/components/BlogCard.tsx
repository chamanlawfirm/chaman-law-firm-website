import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  priority?: boolean;
};

export function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-royalGold/18 bg-charcoal transition hover:-translate-y-1 hover:border-royalGold/45">
      <Link href={`/resources/blog/${post.slug}`} className="block overflow-hidden">
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={720}
          height={450}
          priority={priority}
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-royalGold">
          <Link href={post.categories[0]?.slug ? `/resources/blog?category=${post.categories[0].slug}` : "/resources/blog"} className="hover:text-champagne">
            {post.category}
          </Link>
          <span>|</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h2 className="mt-4 font-heading text-2xl font-semibold leading-snug text-ivory group-hover:text-royalGold">
          <Link href={`/resources/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mt-4 text-sm leading-7 text-ivory/68">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-ivory/58">
            {post.author} | {post.readingTime}
          </p>
          <Link href={`/resources/blog/${post.slug}`} className="shrink-0 text-sm font-bold text-royalGold hover:text-champagne">
            Read More
          </Link>
        </div>
        {post.tags.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full border border-royalGold/16 px-3 py-1 text-xs font-semibold text-ivory/56"
              >
                {tag.title}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
