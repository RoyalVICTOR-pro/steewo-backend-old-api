import { DateTime } from 'luxon'
export function getDatetimeForFileName(): string {
  return DateTime.now().toISO({
    suppressMilliseconds: true,
    includeOffset: false,
    format: 'basic',
  })!
}
