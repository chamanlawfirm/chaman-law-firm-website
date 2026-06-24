import {defineArrayMember, defineField, defineType} from 'sanity'

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string'}),
    defineField({name: 'heroTitle', title: 'Hero Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'heroCopy', title: 'Hero Copy', type: 'text', rows: 4}),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative Text', type: 'string'})],
    }),
    defineField({
      name: 'trustIndicators',
      title: 'Trust Indicators',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'description', type: 'text', rows: 2}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'practiceAreaHighlights',
      title: 'Practice Area Highlights',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})],
    }),
    defineField({name: 'diasporaSection', title: 'Diaspora Section', type: 'blockContent'}),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
    defineField({
      name: 'managingPartner',
      title: 'Managing Partner',
      type: 'reference',
      to: [{type: 'lawyer'}],
    }),
    defineField({
      name: 'featuredArticles',
      title: 'Featured Articles',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})],
    }),
    defineField({
      name: 'featuredDownloads',
      title: 'Featured Downloads',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'download'}]})],
    }),
    defineField({name: 'ctaSection', title: 'CTA Section', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO Settings', type: 'seo'}),
  ],
  preview: {
    select: {title: 'heroTitle', media: 'heroImage'},
  },
})
