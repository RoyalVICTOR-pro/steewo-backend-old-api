import { ProfessionCreateOrUpdateDTO } from 'App/DataAccessLayer/DTO/ProfessionCreateOrUpdateDTO'
import { inject } from '@adonisjs/core/build/standalone'
import ProfessionServiceInterface from 'App/Services/Interfaces/ProfessionServiceInterface'
import { ProfessionRepository } from 'App/DataAccessLayer/Repositories/ProfessionRepository'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import slugify from 'slugify'

@inject()
export class ProfessionService implements ProfessionServiceInterface {
  private professionRepository: ProfessionRepository
  private readonly pictoPath = './professions/pictos/'
  private readonly imagePath = './professions/images/'

  constructor(professionRepository: ProfessionRepository) {
    this.professionRepository = professionRepository
  }

  public async listProfessions() {
    return await this.professionRepository.listProfessions()
  }

  public async getProfessionById(id: number) {
    return await this.professionRepository.getProfessionById(id)
  }

  public async createProfession(
    data: ProfessionCreateOrUpdateDTO,
    pictoFile: MultipartFileContract | null = null,
    imageFile: MultipartFileContract | null = null
  ) {
    if (pictoFile) {
      const sanitizedName = slugify(data.name_fr, { lower: true, strict: true })
      const newName = sanitizedName + '.' + pictoFile.extname
      // On déplace le fichier à la racine du dossier d'uploads
      await pictoFile.moveToDisk(this.pictoPath, { name: newName })
      // On change le nom du thumbnail dans le model
      data.picto_file = this.pictoPath + newName
    }

    if (imageFile) {
      const sanitizedName = slugify(data.name_fr, { lower: true, strict: true })
      const newName = sanitizedName + '.' + imageFile.extname
      // On déplace le fichier à la racine du dossier d'uploads
      await imageFile.moveToDisk(this.imagePath, { name: newName })
      // On change le nom du thumbnail dans le model
      data.image_file = this.imagePath + newName
    }
    console.log('data', data)

    return await this.professionRepository.createProfession(data)
  }

  public async updateProfessionById(idToUpdate: number, data: ProfessionCreateOrUpdateDTO) {
    return await this.professionRepository.updateProfessionById(idToUpdate, data)
  }

  public async deleteProfession(id: number) {
    return await this.professionRepository.deleteProfession(id)
  }
}
