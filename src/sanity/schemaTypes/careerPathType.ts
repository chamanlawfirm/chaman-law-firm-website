import {defineArrayMember, defineField, defineType} from 'sanity'

export const careerPathType = defineType({
  name: 'careerPath',
  title: 'Career Path',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'department', type: 'string'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'type', title: 'Engagement Type', type: 'string'}),
    defineField({name: 'summary', type: 'text', rows: 4}),
    defineField({
      name: 'requirements',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'order', type: 'number'}),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'department'},
  },
})
