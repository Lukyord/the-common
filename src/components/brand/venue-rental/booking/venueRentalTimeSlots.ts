export const VENUE_RENTAL_OPEN_HOUR = 8
export const VENUE_RENTAL_CLOSE_HOUR = 24

export const VENUE_RENTAL_BOOKING_TIME_OPTIONS = [
  { label: 'HALF DAY (5 HRS)', value: '5', hours: 5 },
  { label: 'FULL DAY (10 HRS)', value: '10', hours: 10 },
] as const

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

export function buildVenueRentalStartTimes(durationHours: number): string[] {
  const latestStartHour = VENUE_RENTAL_CLOSE_HOUR - durationHours
  const options: string[] = []

  for (let hour = VENUE_RENTAL_OPEN_HOUR; hour <= latestStartHour; hour += 1) {
    options.push(formatHour(hour))
  }

  return options
}
