import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'clientName', title: 'Client Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'practiceArea', type: 'reference', to: [{type: 'practiceArea'}]}),
    defineField({name: 'review', type: 'text', rows: 5, validation: (Rule) => Rule.required()}),
    defineField({name: 'rating', type: 'number', validation: (Rule) => Rule.min(1).max(5)}),
    defineField({name: 'videoTestimonialUrl', title: 'Video Testimonial URL', type: 'url'}),
    defineField({
      name: 'approvalStatus',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Approved', value: 'approved'},
          {title: 'Archived', value: 'archived'},
        ],
      },
      initialValue: 'draft',
    }),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'clientName', subtitle: 'approvalStatus'},
  },
})
