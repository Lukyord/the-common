export type LegacyOid = {
  _id: { $oid: string }
}

export function getLegacyId(record: LegacyOid): string {
  return record._id.$oid
}

export function oidToDate(oid: string): Date {
  return new Date(Number.parseInt(oid.slice(0, 8), 16) * 1000)
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getMigrationCutoffDate(years = 5, now = new Date()): Date {
  const cutoff = new Date(now)
  cutoff.setFullYear(cutoff.getFullYear() - years)
  cutoff.setHours(0, 0, 0, 0)
  return cutoff
}
