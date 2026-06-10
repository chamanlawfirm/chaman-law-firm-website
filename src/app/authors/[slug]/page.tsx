import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { BlogPagination } from "@/components/BlogPagination";
import { BlogSidebar } from "@/components/BlogSidebar";
import { JsonLd } from "@/components/JsonLd";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import {
  getBlogAuthorBySlug,
  getBlogAuthorSlugs,
  getBlogPostsPage,
  getBlogSidebarData
} from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";

export const revalidate = 60;
const pageSize = 24;

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
};

function getSafePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export async function generateStaticParams() {
  const authors = await getBlogAuthorSlugs();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);

  if (!author) {
    return createMetadata({
      title: "Author Not Found",
      description: "The requested Chaman Properties author could not be found.",
      path: `/authors/${slug}`
    });
  }

  return createMetadata({
    title: `${author.name} Articles`,
    description: `Read real estate articles and property insights by ${author.name} on Chaman Properties.`,
    path: `/authors/${author.slug}`,
    image: author.image,
    keywords: [author.name, "Chaman Properties author", "Nigeria real estate insights"]
  });
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const currentPage = getSafePage(resolvedSearchParams?.page);
  const author = await getBlogAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const [{ posts, total, totalPages }, sidebarData] = await Promise.all([
    getBlogPostsPage({ page: currentPage, pageSize, authorSlug: author.slug }),
    getBlogSidebarData()
  ]);

  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: author.name, path: `/authors/${author.slug}` }
          ])
        ]}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-lg border border-royalGold/16 bg-charcoal p-6 sm:p-8 lg:grid-cols-[160px_minmax(0,1fr)]">
            {author.image ? (
              <Image src={author.image} alt={author.imageAlt || author.name} width={160} height={160} className="h-40 w-40 rounded-full object-cover" priority />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-royalGold/25 bg-luxuryBlack font-heading text-5xl text-royalGold">
                {author.name.slice(0, 1)}
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-royalGold">Chaman Properties Author</p>
              <h1 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">{author.name}</h1>
              <div className="mt-5 text-sm leading-7 text-ivory/70">
                {author.bio.length ? (
                  <PortableTextRenderer value={author.bio} />
                ) : (
                  <p>
                    Practical real estate guidance for buyers, landlords, diaspora investors, and property owners seeking safer decisions in Nigeria.
                  </p>
                )}
              </div>
              <p className="mt-5 text-sm font-semibold text-royalGold">
                {total} published article{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-luxuryBlack pb-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div>
            {posts.length ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {posts.map((post, index) => (
                    <BlogCard key={post.slug} post={post} priority={index < 2 && currentPage === 1} />
                  ))}
                </div>
                <BlogPagination basePath={`/authors/${author.slug}`} currentPage={currentPage} totalPages={totalPages} />
              </>
            ) : (
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-8 text-center text-sm leading-7 text-ivory/68">
                No published articles are currently assigned to this author.
              </div>
            )}
          </div>
          <BlogSidebar {...sidebarData} />
        </div>
      </section>
    </main>
  );
}
