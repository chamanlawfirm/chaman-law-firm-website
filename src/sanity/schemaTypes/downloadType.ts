import {defineArrayMember, defineField, defineType} from 'sanity'

export const downloadType = defineType({
  name: 'download',
  title: 'Download',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'description', type: 'text', rows: 4}),
    defineField({
      name: 'thumbnail',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative Text', type: 'string'})],
    }),
    defineField({name: 'file', title: 'File Upload', type: 'file'}),
    defineField({name: 'category', type: 'string'}),
    defineField({name: 'leadCapture', title: 'Require Lead Capture', type: 'boolean', initialValue: true}),
    defineField({
      name: 'relatedPracticeAreas',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})],
    }),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'thumbnail'},
  },
})
