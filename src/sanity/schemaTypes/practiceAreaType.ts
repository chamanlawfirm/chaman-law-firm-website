import {defineArrayMember, defineField, defineType} from 'sanity'

export const practiceAreaType = defineType({
  name: 'practiceArea',
  title: 'Practice Area',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'summary', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(220)}),
    defineField({name: 'description', type: 'text', rows: 5}),
    defineField({name: 'heroSection', title: 'Hero Section', type: 'blockContent'}),
    defineField({name: 'detailedContent', title: 'Detailed Content', type: 'blockContent'}),
    defineField({
      name: 'services',
      title: 'Services Covered',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'servicePages',
      title: 'Detailed Service Pages',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
            defineField({name: 'summary', type: 'text', rows: 3}),
            defineField({name: 'description', type: 'text', rows: 5}),
            defineField({name: 'keyPoints', type: 'array', of: [defineArrayMember({type: 'string'})]}),
            defineField({name: 'process', type: 'array', of: [defineArrayMember({type: 'string'})]}),
            defineField({
              name: 'faqs',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'question', type: 'string'}),
                    defineField({name: 'answer', type: 'text', rows: 3}),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'commonIssues',
      title: 'Common Issues',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'whoWeHelp',
      title: 'Who We Help',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'process',
      title: 'Process Steps',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'answer', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
    defineField({
      name: 'downloads',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'download'}]})],
    }),
    defineField({
      name: 'relatedDownloads',
      title: 'Related Download Slugs',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Optional fallback slug mapping for frontend relationships.',
    }),
    defineField({
      name: 'lawyers',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'lawyer'}]})],
    }),
    defineField({
      name: 'relatedArticles',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})],
    }),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
