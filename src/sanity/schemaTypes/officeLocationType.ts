import {defineArrayMember, defineField, defineType} from 'sanity'

export const officeLocationType = defineType({
  name: 'officeLocation',
  title: 'Office Location',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'address', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'coordinates',
      type: 'object',
      fields: [
        defineField({name: 'lat', title: 'Latitude', type: 'number'}),
        defineField({name: 'lng', title: 'Longitude', type: 'number'}),
      ],
    }),
    defineField({name: 'phone', type: 'string'}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'mapLink', title: 'Map Link', type: 'url'}),
    defineField({
      name: 'businessHours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'day', type: 'string'}),
            defineField({name: 'hours', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alternative Text', type: 'string'})],
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO Fields', type: 'seo'}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'address'},
  },
})
