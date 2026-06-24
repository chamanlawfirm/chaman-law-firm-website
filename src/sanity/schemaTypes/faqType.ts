import {defineField, defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({name: 'question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'answer', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({name: 'category', type: 'string'}),
    defineField({name: 'practiceArea', type: 'reference', to: [{type: 'practiceArea'}]}),
    defineField({name: 'order', type: 'number'}),
    defineField({name: 'featured', title: 'Featured Status', type: 'boolean', initialValue: false}),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'question', subtitle: 'category'},
  },
})
