import {defineArrayMember, defineField, defineType} from 'sanity'

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(220)}),
    defineField({
      name: 'featuredImage',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative Text', type: 'string'})],
    }),
    defineField({name: 'author', type: 'reference', to: [{type: 'author'}, {type: 'lawyer'}]}),
    defineField({
      name: 'practiceAreas',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})],
    }),
    defineField({name: 'categories', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})]}),
    defineField({name: 'tags', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'body', title: 'Body Content', type: 'blockContent', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'faqs',
      title: 'FAQs',
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
    defineField({name: 'downloads', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'download'}]})]}),
    defineField({name: 'relatedArticles', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})]}),
    defineField({name: 'publishedAt', title: 'Published Date', type: 'datetime'}),
    defineField({name: 'updatedAt', title: 'Updated Date', type: 'datetime'}),
    defineField({name: 'featured', title: 'Featured Status', type: 'boolean', initialValue: false}),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'excerpt', media: 'featuredImage'},
  },
})
