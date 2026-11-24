import {defineArrayMember, defineField, defineType} from "sanity";
import {disciplines, researchTypes} from "../../data/research";

export const researchAuthorType = defineType({
  name: "researchAuthor",
  title: "Research Authors",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (rule) => rule.required() }),
    defineField({ name: "affiliation", type: "string" }),
    defineField({ name: "bio", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "institutional", type: "boolean", initialValue: false }),
    defineField({ name: "verified", type: "boolean", initialValue: false, validation: (rule) => rule.custom((value) => value === true || "Verify consent, identity and affiliations before publishing.") }),
  ],
});

const link = defineArrayMember({
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "url", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
  ],
});

export const researchPublicationType = defineType({
  name: "researchPublication",
  title: "Research Publications",
  type: "document",
  initialValue: { editorialStatus: "draft", publicationType: "flagship" },
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "subtitle", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "researchId", title: "Research ID", type: "string", validation: (rule) => rule.required().regex(/^CLRIP-[A-Z0-9-]+$/) }),
    defineField({ name: "abstract", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "keywords", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(1).unique() }),
    defineField({ name: "discipline", type: "string", options: { list: disciplines.map(({ id, title }) => ({ value: id, title })) }, validation: (rule) => rule.required() }),
    defineField({ name: "publicationType", type: "string", options: { list: [...researchTypes] }, validation: (rule) => rule.required() }),
    defineField({ name: "author", type: "reference", to: [{ type: "researchAuthor" }], validation: (rule) => rule.required() }),
    defineField({ name: "coAuthors", type: "array", of: [{ type: "reference", to: [{ type: "researchAuthor" }] }] }),
    defineField({ name: "affiliation", type: "string" }),
    defineField({ name: "editorialReviewer", type: "string", description: "Record an actual reviewer with their consent. Kept out of the public site." }),
    defineField({ name: "methodology", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "sections", title: "Research sections and table of contents", type: "array", validation: (rule) => rule.required().min(1), of: [
      defineArrayMember({ type: "object", fields: [
        defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "text", type: "text", description: "Separate paragraphs with blank lines. Use [1], [2] and so on for footnotes.", validation: (rule) => rule.required() }),
      ] }),
    ] }),
    defineField({ name: "footnotes", type: "array", description: "Order determines the number referenced in the text.", of: [
      defineArrayMember({ type: "object", fields: [
        defineField({ name: "citation", type: "text", validation: (rule) => rule.required() }),
        defineField({ name: "url", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
      ] }),
    ] }),
    defineField({ name: "judicialAuthorities", type: "array", of: [link] }),
    defineField({ name: "legislation", type: "array", of: [link] }),
    defineField({ name: "academicReferences", type: "array", of: [link] }),
    defineField({ name: "bibliography", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "jurisdictions", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "publishedAt", type: "datetime", validation: (rule) => rule.custom((value, ctx) => ctx.document?.editorialStatus !== "approved" || Boolean(value) || "Enter the actual release date before approval.") }),
    defineField({ name: "reviewedAt", type: "date" }),
    defineField({ name: "revisions", type: "array", of: [
      defineArrayMember({ type: "object", fields: [
        defineField({ name: "date", type: "date", validation: (rule) => rule.required() }),
        defineField({ name: "note", type: "text", validation: (rule) => rule.required() }),
      ] }),
    ] }),
    defineField({ name: "findings", type: "text" }),
    defineField({ name: "recommendations", type: "text" }),
    defineField({ name: "pdf", type: "file", options: { accept: "application/pdf" }, validation: (rule) => rule.custom((value, ctx) => ctx.document?.editorialStatus !== "approved" || Boolean(value?.asset?._ref) || "Attach the approved, matching PDF before publication.") }),
    defineField({ name: "suggestedCitation", type: "text" }),
    defineField({ name: "externalPublications", type: "array", of: [link] }),
    defineField({ name: "editorialStatus", type: "string", options: { list: [
      { title: "Draft", value: "draft" }, { title: "In Review", value: "inReview" },
      { title: "Approved", value: "approved" },
    ] }, validation: (rule) => rule.required() }),
    defineField({ name: "seoTitle", type: "string" }),
    defineField({ name: "seoDescription", type: "text" }),
    defineField({ name: "canonicalUrl", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
    defineField({ name: "featuredImage", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", validation: (rule) => rule.required() })] }),
    defineField({ name: "relatedPublications", type: "array", of: [{ type: "reference", to: [{ type: "researchPublication" }] }] }),
    defineField({ name: "wordCount", type: "number", validation: (rule) => rule.integer().positive() }),
    defineField({ name: "readingMinutes", type: "number", validation: (rule) => rule.integer().positive() }),
    defineField({ name: "rights", title: "Copyright and licensing", type: "text", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "title", subtitle: "editorialStatus", media: "featuredImage" } },
});
