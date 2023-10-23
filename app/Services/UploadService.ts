import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import slugify from 'slugify'
import Drive from '@ioc:Adonis/Core/Drive'

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

  public static async deleteFile(path: string) {
    Drive.delete(path)
  }
}
