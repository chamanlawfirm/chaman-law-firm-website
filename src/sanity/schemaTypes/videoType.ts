import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const videoType = defineType({
  name: 'video',
  title: 'Legal Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(220)}),
    defineField({name: 'duration', type: 'string', description: 'For example: 08:30'}),
    defineField({name: 'videoUrl', type: 'url', validation: (Rule) => Rule.required()}),
    defineField({name: 'author', title: 'Presenter or Author', type: 'reference', to: [{type: 'author'}, {type: 'lawyer'}], validation: (Rule) => Rule.required()}),
    defineField({name: 'featuredImage', type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string', validation: (Rule) => Rule.required()})]}),
    defineField({name: 'body', title: 'Video Summary', type: 'blockContent', validation: (Rule) => Rule.required()}),
    defineField({name: 'transcript', type: 'text', rows: 14}),
    defineField({name: 'publishedAt', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'updatedAt', type: 'datetime'}),
    defineField({name: 'tags', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'relatedPracticeAreas', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'practiceArea'}]})]}),
    defineField({name: 'faqs', type: 'array', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'question', type: 'string'}), defineField({name: 'answer', type: 'text', rows: 3})]})]}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'duration', media: 'featuredImage'}},
})
