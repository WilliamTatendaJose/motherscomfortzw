'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { recordsStructure, structure } from './sanity/structure'
import {
  contentSchemaTypes,
  recordSchemaTypes,
  singletonNames,
} from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const recordsDataset = process.env.NEXT_PUBLIC_SANITY_DONATIONS_DATASET ?? 'donations'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01'

const singletons = new Set<string>(singletonNames)

export default defineConfig([
  {
    name: 'content',
    title: "Mother's Comfort",
    // Sanity requires every workspace basePath to have the same number of
    // segments, so this is /studio/content rather than /studio. Visiting
    // /studio shows the workspace picker.
    basePath: '/studio/content',
    projectId,
    dataset,
    schema: {
      types: contentSchemaTypes,
      // Singletons are reached through the desk, never created ad hoc.
      templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
    },
    document: {
      // Remove "Delete"/"Duplicate" from singletons so the desk entry can't
      // end up pointing at a document that no longer exists.
      actions: (actions, { schemaType }) =>
        singletons.has(schemaType)
          ? actions.filter(
              ({ action }) => action && !['delete', 'duplicate', 'unpublish'].includes(action),
            )
          : actions,
    },
    plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  },
  {
    name: 'records',
    title: 'Donations & enquiries',
    basePath: '/studio/records',
    projectId,
    dataset: recordsDataset,
    schema: { types: recordSchemaTypes },
    document: {
      // Records are written by the site; nothing here should be hand-authored.
      newDocumentOptions: () => [],
    },
    plugins: [structureTool({ structure: recordsStructure })],
  },
])
