import {defineArrayMember, defineField, defineType} from 'sanity'

export const mediaItemType = defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Video', value: 'Video'},
          {title: 'Podcast', value: 'Podcast'},
          {title: 'News', value: 'News'},
          {title: 'Court Update', value: 'Court Update'},
          {title: 'Webinar', value: 'Webinar'},
          {title: 'Media Feature', value: 'Media Feature'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 4}),
    defineField({name: 'channel', type: 'string'}),
    defineField({name: 'publishedAt', type: 'datetime'}),
    defineField({name: 'externalUrl', title: 'External URL', type: 'url'}),
    defineField({
      name: 'relatedPracticeAreas',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})],
    }),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'type'},
  },
})
