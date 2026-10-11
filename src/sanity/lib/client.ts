import 'server-only'

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

export const publicClient = client

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN,
  useCdn: false,
  perspective: 'drafts',
})
