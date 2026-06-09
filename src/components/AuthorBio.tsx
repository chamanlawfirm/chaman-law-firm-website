import Image from "next/image";
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
                Chaman Properties shares practical real estate guidance for buyers, landlords, diaspora investors, and property owners seeking safer decisions in Nigeria.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
