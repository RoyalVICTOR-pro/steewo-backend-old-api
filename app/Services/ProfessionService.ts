import { ProfessionCreateOrUpdateDTO } from '@DTO/ProfessionCreateOrUpdateDTO'
import { inject } from '@adonisjs/core/build/standalone'
import ProfessionServiceInterface from '@Services/Interfaces/ProfessionServiceInterface'
import { ProfessionRepository } from '@DALRepositories/ProfessionRepository'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import UploadService from '@Services/UploadService'
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
      data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name_fr)
    }

    if (imageFile) {
      data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name_fr)
    }
    return await this.professionRepository.createProfession(data)
  }

  public async updateProfessionById(
    idToUpdate: number,
    data: ProfessionCreateOrUpdateDTO,
    pictoFile: MultipartFileContract | null = null,
    imageFile: MultipartFileContract | null = null
  ) {
    if (pictoFile || imageFile) {
      const oldProfession = await this.professionRepository.getProfessionById(idToUpdate)
      if (pictoFile) {
        if (oldProfession.picto_file) {
          await UploadService.deleteFile(oldProfession.picto_file)
        }
        data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name_fr)
      }
      if (imageFile) {
        if (oldProfession.image_file) {
          await UploadService.deleteFile(oldProfession.image_file)
        }
        data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name_fr)
      }
    }
    return await this.professionRepository.updateProfessionById(idToUpdate, data)
  }

  public async deleteProfession(idToDelete: number) {
    const professionToDelete = await this.professionRepository.getProfessionById(idToDelete)
    if (professionToDelete.picto_file) {
      await UploadService.deleteFile(professionToDelete.picto_file)
    }

    if (professionToDelete.image_file) {
      await UploadService.deleteFile(professionToDelete.image_file)
    }
    return await this.professionRepository.deleteProfession(idToDelete)
  }
}
