import {MicrophoneIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const podcastType = defineType({
  name: 'podcast',
  title: 'Podcast Episode',
  type: 'document',
  icon: MicrophoneIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(220)}),
    defineField({name: 'episodeNumber', type: 'number', validation: (Rule) => Rule.integer().positive()}),
    defineField({name: 'duration', type: 'string', description: 'For example: 32 minutes'}),
    defineField({name: 'audioUrl', type: 'url', validation: (Rule) => Rule.required()}),
    defineField({name: 'author', title: 'Host or Author', type: 'reference', to: [{type: 'author'}, {type: 'lawyer'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'featuredImage', type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string', validation: (Rule) => Rule.required()})]}),
    defineField({name: 'body', title: 'Episode Summary', type: 'blockContent', validation: (Rule) => Rule.required()}),
    defineField({name: 'transcript', type: 'text', rows: 14}),
    defineField({name: 'publishedAt', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'updatedAt', type: 'datetime'}),
    defineField({name: 'tags', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'relatedPracticeAreas', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})]}),
    defineField({name: 'faqs', type: 'array', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'question', type: 'string'}), defineField({name: 'answer', type: 'text', rows: 3})]})]}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'episodeNumber', media: 'featuredImage'}},
})
