import type { Where } from 'payload'

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isArchiveDateSet(dateToBeArchived?: string | null) {
  if (dateToBeArchived == null) return false

  const trimmed = dateToBeArchived.trim()
  if (!trimmed) return false

  return !Number.isNaN(new Date(trimmed).getTime())
}

export function getActiveWhatsOnWhere(): Where {
  const today = getTodayDateString()

  return {
    or: [
      {
        dateToBeArchived: {
          exists: false,
        },
      },
      {
        dateToBeArchived: {
          equals: null,
        },
      },
      {
        dateToBeArchived: {
          equals: '',
        },
      },
      {
        dateToBeArchived: {
          greater_than: today,
        },
      },
    ],
  }
}

export function isWhatsOnArchived(item: { dateToBeArchived?: string | null }) {
  if (!isArchiveDateSet(item.dateToBeArchived)) return false

  const archiveDate = new Date(item.dateToBeArchived!)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  archiveDate.setHours(0, 0, 0, 0)

  return archiveDate <= today
}
