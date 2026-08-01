import type { SchemaTypeDefinition } from 'sanity'

import { collectionTypes } from './collections'
import { objectTypes } from './objects'
import { recordTypes } from './records'
import { singletonTypes } from './singletons'
import { story } from './story'

/** Content schema — the `production` dataset workspace. */
export const contentSchemaTypes: SchemaTypeDefinition[] = [
  ...objectTypes,
  ...singletonTypes,
  story,
  ...collectionTypes,
]

/** Records written by the website — the private `donations` dataset workspace. */
export const recordSchemaTypes: SchemaTypeDefinition[] = [...recordTypes]

export { singletonNames } from './singletons'
