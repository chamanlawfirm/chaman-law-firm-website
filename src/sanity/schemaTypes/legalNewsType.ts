import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const legalNewsType = defineType({
  name: 'legalNews',
  title: 'Legal News',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(220)}),
    defineField({name: 'author', type: 'reference', to: [{type: 'author'}, {type: 'lawyer'}], validation: (Rule) => Rule.required()}),
    defineField({
      name: 'featuredImage',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', validation: (Rule) => Rule.required()})],
    }),
    defineField({name: 'body', type: 'blockContent', validation: (Rule) => Rule.required()}),
    defineField({name: 'publishedAt', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'updatedAt', type: 'datetime'}),
    defineField({
      name: 'newsCategory',
      title: 'News category',
      type: 'string',
      description: 'Use one editorial section for each story. Categories organise coverage without creating duplicate news articles.',
      options: {list: [
        {title: 'Nigeria: National Affairs', value: 'national-affairs'},
        {title: 'Government & Public Policy', value: 'government-policy'},
        {title: 'Economy, Business & Finance', value: 'economy-business'},
        {title: 'Property, Housing & Infrastructure', value: 'property-housing'},
        {title: 'Courts, Law & Regulation', value: 'law-regulation'},
        {title: 'Security & Public Safety', value: 'security'},
        {title: 'Education, Health & Society', value: 'society'},
        {title: 'Technology & Innovation', value: 'technology'},
        {title: 'States & Local Communities', value: 'states-local'},
        {title: 'International Affairs Affecting Nigeria', value: 'international'}
      ]},
    }),
    defineField({
      name: 'reportingType',
      title: 'Editorial format',
      type: 'string',
      description: 'Distinguish original reporting from independently verified summaries and opinion.',
      options: {list: [
        {title: 'Original reporting', value: 'original'},
        {title: 'Verified news summary', value: 'verified-summary'},
        {title: 'Analysis / Explainer', value: 'analysis'},
        {title: 'Opinion / Commentary', value: 'opinion'},
        {title: 'Correction / Update', value: 'correction'}
      ]},
    }),
    defineField({name: 'primarySourceName', title: 'Primary source name', type: 'string', description: 'Official document, direct interview, agency, or originating publisher. Attribute external reporting.'}),
    defineField({name: 'primarySourceUrl', title: 'Primary source URL', type: 'url', validation: (Rule) => Rule.uri({scheme: ['https']})}),
    defineField({name: 'verifiedAt', title: 'Facts last verified', type: 'datetime'}),
    defineField({name: 'correctionNote', title: 'Published correction note', type: 'text', rows: 3, description: 'Describe material corrections transparently; retain update history.'}),
    defineField({name: 'tags', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'relatedPracticeAreas', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})]}),
    defineField({name: 'faqs', type: 'array', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'question', type: 'string'}), defineField({name: 'answer', type: 'text', rows: 3})]})]}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'featuredImage'}},
})
