import { getPayload } from 'payload'

import config from '../../../src/payload.config.js'

let payloadPromise: ReturnType<typeof getPayload> | null = null

export async function getMigrationPayload() {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config })
  }

  return payloadPromise
}

export async function resolveBranchId(payload: Awaited<ReturnType<typeof getMigrationPayload>>, slug: string) {
  const { docs } = await payload.find({
    collection: 'branches',
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  return docs[0]?.id ?? null
}

export async function resolveMainTagId(
  payload: Awaited<ReturnType<typeof getMigrationPayload>>,
  text: string,
) {
  const { docs } = await payload.find({
    collection: 'whats-on-main-tags',
    where: { text: { equals: text } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  return docs[0]?.id ?? null
}

export async function resolveSubTagIds(
  payload: Awaited<ReturnType<typeof getMigrationPayload>>,
  texts: string[],
) {
  const ids: number[] = []

  for (const text of texts) {
    const { docs } = await payload.find({
      collection: 'whats-on-sub-tags',
      where: { text: { equals: text } },
      limit: 1,
      pagination: false,
      overrideAccess: true,
    })

    if (docs[0]?.id) ids.push(docs[0].id)
  }

  return ids
}

export async function findExistingWhatsOnByLegacyId(
  payload: Awaited<ReturnType<typeof getMigrationPayload>>,
  legacyId: string,
) {
  const { docs } = await payload.find({
    collection: 'whats-on',
    where: { slug: { contains: legacyId.slice(-6) } },
    limit: 5,
    pagination: false,
    overrideAccess: true,
  })

  return docs.find((doc) => doc.slug.endsWith(legacyId.slice(-6))) ?? null
}
