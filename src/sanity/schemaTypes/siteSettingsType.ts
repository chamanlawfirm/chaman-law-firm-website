import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'siteName', title: 'Site Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'primaryDomain', title: 'Primary Domain', type: 'url'}),
    defineField({
      name: 'contactDetails',
      title: 'Contact Details',
      type: 'object',
      fields: [
        defineField({name: 'phone', title: 'Main Phone', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp', type: 'string'}),
        defineField({name: 'email', title: 'Primary Email', type: 'string'}),
        defineField({name: 'secondaryEmail', title: 'Secondary Email', type: 'string'}),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
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
      title: 'Office Locations',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'officeLocation'}]})],
    }),
    defineField({name: 'businessInformation', title: 'Business Information', type: 'blockContent'}),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative Text', type: 'string'})],
    }),
    defineField({
      name: 'analyticsIds',
      title: 'Analytics IDs',
      type: 'object',
      fields: [
        defineField({name: 'ga4', title: 'GA4 Measurement ID', type: 'string'}),
        defineField({name: 'gtm', title: 'Google Tag Manager ID', type: 'string'}),
        defineField({name: 'searchConsole', title: 'Search Console Verification', type: 'string'}),
        defineField({name: 'bingWebmaster', title: 'Bing Webmaster Verification', type: 'string'}),
      ],
    }),
    defineField({name: 'seo', title: 'Default SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'siteName', subtitle: 'primaryDomain'},
  },
})
