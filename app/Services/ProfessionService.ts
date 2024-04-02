// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
// DTO
import ProfessionCreateOrUpdateDTO from '@DTO/ProfessionCreateOrUpdateDTO'
import ProfessionStatusUpdateDTO from '@DTO/ProfessionStatusUpdateDTO'
// INTERFACES
import ProfessionServiceInterface from '@Services/Interfaces/ProfessionServiceInterface'
// REPOSITORIES
import ProfessionRepository from '@DALRepositories/ProfessionRepository'
// SERVICES
import UploadService from '@Services/UploadService'
@inject()
export default class ProfessionService implements ProfessionServiceInterface {
  private professionRepository: ProfessionRepository
  private readonly pictoPath = 'professions/pictos/'
  private readonly imagePath = 'professions/images/'

  constructor(professionRepository: ProfessionRepository) {
    this.professionRepository = professionRepository
  }

  public async listProfessions() {
    return await this.professionRepository.listProfessions()
  }

  public async listPublicProfessions() {
    return await this.professionRepository.listPublicProfessions()
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
      data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name)
    }

    if (imageFile) {
      data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name)
    }
    return await this.professionRepository.createProfession(data)
  }

  public async updateProfessionById(
    idToUpdate: number,
    data: ProfessionCreateOrUpdateDTO,
    pictoFile: MultipartFileContract | null = null,
    imageFile: MultipartFileContract | null = null
  ) {
    const oldProfession = await this.professionRepository.getProfessionById(idToUpdate)

    if (pictoFile || imageFile) {
      if (pictoFile) {
        if (oldProfession.picto_file) {
          await UploadService.deleteFile(oldProfession.picto_file)
        }
        data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name)
      }
      if (imageFile) {
        if (oldProfession.image_file) {
          await UploadService.deleteFile(oldProfession.image_file)
        }
        data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name)
      }
    }

    if (oldProfession.name !== data.name && oldProfession.picto_file && !pictoFile) {
      data.picto_file = await UploadService.renameFile(oldProfession.picto_file, data.name)
    }
    if (oldProfession.name !== data.name && oldProfession.image_file && !imageFile) {
      data.image_file = await UploadService.renameFile(oldProfession.image_file, data.name)
    }
    return await this.professionRepository.updateProfessionById(idToUpdate, data)
  }

  public async updateProfessionStatusById(idToUpdate: number, data: ProfessionStatusUpdateDTO) {
    return await this.professionRepository.updateProfessionStatusById(idToUpdate, data)
  }

  public async deleteProfessionPicto(idToDelete: number) {
    const professionToDelete = await this.professionRepository.getProfessionById(idToDelete)
    if (professionToDelete.picto_file) {
      await UploadService.deleteFile(professionToDelete.picto_file)
    }
    return await this.professionRepository.deleteProfessionPicto(idToDelete)
  }

  public async deleteProfessionImage(idToDelete: number) {
    const professionToDelete = await this.professionRepository.getProfessionById(idToDelete)
    if (professionToDelete.image_file) {
      await UploadService.deleteFile(professionToDelete.image_file)
    }
    return await this.professionRepository.deleteProfessionImage(idToDelete)
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
