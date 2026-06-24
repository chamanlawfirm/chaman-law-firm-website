import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";

type AuthorBioProps = {
  post: BlogPost;
};

export function AuthorBio({ post }: AuthorBioProps) {
  const author = post.authorProfile;

  return (
    <section className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">About the Author</p>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.imageAlt || author.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-royalGold/25 bg-luxuryBlack font-heading text-2xl text-royalGold">
            {author.name.slice(0, 1)}
          </div>
        )}
        <div>
          <h2 className="font-heading text-2xl font-semibold text-ivory">{author.name}</h2>
          <div className="mt-3 text-sm leading-7 text-ivory/68">
            {author.bio.length ? (
              <PortableTextRenderer value={author.bio} />
            ) : (
              <p>
                Chaman Law Firm shares practical legal guidance for property clients, business owners, families, diaspora clients, and professionals seeking safer decisions in Nigeria.
              </p>
            )}
          </div>
          <div className="mt-5 rounded-md border border-royalGold/12 bg-luxuryBlack p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-royalGold">Author Expertise</p>
            <p className="mt-2 text-sm leading-7 text-ivory/66">
              Practical guidance on {post.category.toLowerCase()}, legal risk, documentation, dispute prevention,
              business decisions, and diaspora legal support.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.categories.slice(0, 3).map((category) =>
                category.slug ? (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="rounded-full border border-royalGold/16 px-3 py-1 text-xs font-semibold text-ivory/58 transition hover:border-royalGold/40 hover:text-royalGold"
                  >
                    {category.title}
                  </Link>
                ) : null
              )}
              {post.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border border-royalGold/16 px-3 py-1 text-xs font-semibold text-ivory/58 transition hover:border-royalGold/40 hover:text-royalGold"
                >
                  {tag.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
