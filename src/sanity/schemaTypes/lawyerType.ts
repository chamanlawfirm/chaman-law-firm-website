import {defineArrayMember, defineField, defineType} from 'sanity'

export const lawyerType = defineType({
  name: 'lawyer',
  title: 'Lawyer',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'photo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative Text', type: 'string'})],
    }),
    defineField({name: 'position', type: 'string'}),
    defineField({name: 'summary', type: 'text', rows: 3}),
    defineField({name: 'biography', type: 'blockContent'}),
    defineField({name: 'qualifications', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'education', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'memberships', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'awards', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'experience', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({
      name: 'practiceAreas',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})],
    }),
    defineField({name: 'mediaAppearances', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'publicationsText', title: 'Publication Notes', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({
      name: 'publications',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})],
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'platform', type: 'string'}),
            defineField({name: 'url', type: 'url'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'officeLocations',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'officeLocation'}]})],
    }),
    defineField({name: 'philosophy', title: 'Professional Philosophy', type: 'text', rows: 3}),
    defineField({name: 'featured', title: 'Featured Status', type: 'boolean', initialValue: false}),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'position', media: 'photo'},
  },
})
