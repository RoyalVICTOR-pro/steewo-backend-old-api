import { ServiceCreateOrUpdateDTO } from 'App/DataAccessLayer/DTO/ServiceCreateOrUpdateDTO'
import { inject } from '@adonisjs/core/build/standalone'
import ServiceServiceInterface from 'App/Services/Interfaces/ServiceServiceInterface'
import { ServiceRepository } from 'App/DataAccessLayer/Repositories/ServiceRepository'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import UploadService from 'App/Services/UploadService'
@inject()
export class ServiceService implements ServiceServiceInterface {
  private serviceRepository: ServiceRepository
  private readonly pictoPath = './services/pictos/'
  private readonly imagePath = './services/images/'

  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository
  }

  public async listServicesByProfession(professionId: number) {
    return await this.serviceRepository.listServicesByProfession(professionId)
  }

  public async getServiceById(id: number) {
    return await this.serviceRepository.getServiceById(id)
  }

  public async createService(
    data: ServiceCreateOrUpdateDTO,
    pictoFile: MultipartFileContract | null = null,
    imageFile: MultipartFileContract | null = null
  ) {
    if (pictoFile) {
      data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name_fr)
    }

    if (imageFile) {
      data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name_fr)
    }
    return await this.serviceRepository.createService(data)
  }

  public async updateServiceById(
    idToUpdate: number,
    data: ServiceCreateOrUpdateDTO,
    pictoFile: MultipartFileContract | null = null,
    imageFile: MultipartFileContract | null = null
  ) {
    if (pictoFile || imageFile) {
      const oldService = await this.serviceRepository.getServiceById(idToUpdate)
      if (pictoFile) {
        if (oldService.picto_file) {
          await UploadService.deleteFile(oldService.picto_file)
        }
        data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name_fr)
      }
      if (imageFile) {
        if (oldService.image_file) {
          await UploadService.deleteFile(oldService.image_file)
        }
        data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name_fr)
      }
    }
    return await this.serviceRepository.updateServiceById(idToUpdate, data)
  }

  public async deleteService(idToDelete: number) {
    const serviceToDelete = await this.serviceRepository.getServiceById(idToDelete)
    if (serviceToDelete.picto_file) {
      await UploadService.deleteFile(serviceToDelete.picto_file)
    }

    if (serviceToDelete.image_file) {
      await UploadService.deleteFile(serviceToDelete.image_file)
    }
    return await this.serviceRepository.deleteService(idToDelete)
  }
}
