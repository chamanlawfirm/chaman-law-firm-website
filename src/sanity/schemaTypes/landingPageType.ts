import {defineArrayMember, defineField, defineType} from 'sanity'

export const landingPageType = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'targetAudience', title: 'Target Audience', type: 'string'}),
    defineField({name: 'problemStatement', title: 'Problem Statement', type: 'text', rows: 4}),
    defineField({name: 'solution', type: 'blockContent'}),
    defineField({
      name: 'testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
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
    defineField({name: 'leadFormLabel', title: 'Lead Form Label', type: 'string'}),
    defineField({
      name: 'ctaBlocks',
      title: 'CTA Blocks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'href', type: 'string'}),
            defineField({name: 'style', type: 'string', options: {list: ['primary', 'secondary', 'whatsapp', 'phone']}}),
          ],
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'targetAudience'},
  },
})
