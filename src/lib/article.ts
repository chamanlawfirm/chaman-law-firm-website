import type { BlogPost, Faq } from "@/lib/types";

export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blockText(block: Record<string, unknown>) {
  const children = Array.isArray(block.children) ? block.children : [];

  return children
    .map((child) => {
      if (child && typeof child === "object" && "text" in child) {
        return String(child.text || "");
      }

      return "";
    })
    .join("")
    .trim();
}

export function getArticleHeadings(blocks: Array<Record<string, unknown>>) {
  return blocks
    .filter((block) => ["h2", "h3", "h4"].includes(String(block.style || "")))
    .map((block) => {
      const text = blockText(block);
      const level = Number(String(block.style).replace("h", "")) as 2 | 3 | 4;

      return {
        id: slugifyHeading(text || "section"),
        text,
        level
      };
    })
    .filter((heading) => heading.text);
}

export function getArticleFaqs(post: BlogPost): Faq[] {
  if (post.faqs?.length) {
    return post.faqs;
  }

  const category = post.category.toLowerCase();

  return [
    {
      question: `What should I confirm before acting on this ${category} topic?`,
      answer:
        "Confirm the property's location, seller authority, title documents, inspection condition, pricing, payment trail, and post-purchase management requirements before making a commitment."
    },
    {
      question: "Can Chaman Properties help with verification and property advisory?",
      answer:
        "Yes. Chaman Properties supports property search, inspection, negotiation, management, investment advisory, and legal due diligence coordination through qualified professionals where required."
    },
    {
      question: "Can diaspora clients use this guidance when buying property in Nigeria?",
      answer:
        "Yes. Chaman Properties works with Nigerians abroad by coordinating property inspection, video reporting, documentation support, tenant sourcing, rent collection, maintenance, and periodic asset reporting."
    }
  ];
}
