'use client'

import { SaveButton } from '@payloadcms/ui'
import type { SaveButtonClientProps } from 'payload'

export function UpdatePageSaveButton(props: SaveButtonClientProps) {
  return <SaveButton {...props} label="Update Page" />
}
