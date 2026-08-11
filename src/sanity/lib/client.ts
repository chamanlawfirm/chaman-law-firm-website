import 'server-only'

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})
