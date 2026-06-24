import {defineArrayMember, defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO Fields',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Keep meta titles around 60 characters.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning('Keep meta descriptions around 150-160 characters.'),
    }),
    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Social Sharing Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'openGraphTitle',
      title: 'Open Graph Title',
      type: 'string',
      validation: (Rule) => Rule.max(70).warning('Keep social titles concise.'),
    }),
    defineField({
      name: 'openGraphDescription',
      title: 'Open Graph Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200).warning('Keep social descriptions concise.'),
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'robots',
      title: 'Robots Settings',
      type: 'string',
      options: {
        list: [
          {title: 'Index, follow', value: 'index,follow'},
          {title: 'Noindex, follow', value: 'noindex,follow'},
          {title: 'Noindex, nofollow', value: 'noindex,nofollow'},
        ],
      },
    }),
    defineField({
      name: 'schemaType',
      title: 'Preferred Schema Type',
      type: 'string',
      options: {
        list: [
          {title: 'WebPage', value: 'WebPage'},
          {title: 'LegalService', value: 'LegalService'},
          {title: 'Article', value: 'Article'},
          {title: 'FAQPage', value: 'FAQPage'},
          {title: 'Attorney', value: 'Attorney'},
        ],
      },
    }),
    defineField({
      name: 'aeoKeywords',
      title: 'AEO Keywords',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'geoKeywords',
      title: 'GEO Keywords',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
  ],
})
