import { DateTime } from 'luxon'
export function getDatetimeForFileName(): string {
  return DateTime.now().toISO({
    suppressMilliseconds: true,
    includeOffset: false,
    format: 'basic',
  })!
}

export function getExtension(filePath: string): string {
  return filePath.split('.').pop()!
}

export function getFileTypeFromExtension(extension: string): string {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image'
    case 'mp4':
      return 'video'
    case 'pdf':
      return 'pdf'
    case 'mp3':
      return 'audio'
    default:
      return 'unknown'
  }
}
