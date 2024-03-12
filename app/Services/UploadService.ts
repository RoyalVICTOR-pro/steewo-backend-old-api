import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Drive from '@ioc:Adonis/Core/Drive'
import slugify from 'slugify'

export default class UploadService {
  public static async uploadFileTo(
    file: MultipartFileContract,
    folder: string,
    withNameFrom: string = ''
  ) {
    if (folder.slice(-1) !== '/') folder += '/'

    const sanitizedName = slugify(withNameFrom, { lower: true, strict: true })
    const newName = sanitizedName + '.' + file.extname

    await file.moveToDisk(folder, { name: newName })

    return folder + newName
  }

  public static async renameFile(oldPath: string, newName: string) {
    const splittedPath = oldPath.split('/')
    const fileName = splittedPath[splittedPath.length - 1]
    const extension = fileName.split('.').pop()
    const pathElements = splittedPath.slice(0, splittedPath.length - 1)
    const path = pathElements.join('/')
    const sanitizedName = slugify(newName, { lower: true, strict: true })
    const newPath = path + '/' + sanitizedName + '.' + extension

    if (await Drive.exists(oldPath)) {
      await Drive.move(oldPath, newPath)
      return newPath
    }
    return oldPath
  }

  public static async deleteFile(path: string) {
    await Drive.delete(path)
  }
}
