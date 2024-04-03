// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
// DTO
import ServiceCreateOrUpdateDTO from '@DTO/ServiceCreateOrUpdateDTO'
import ServiceStatusUpdateDTO from '@DTO/ServiceStatusUpdateDTO'
// INTERFACES
import ServiceServiceInterface from '@Services/Interfaces/ServiceServiceInterface'
// REPOSITORIES
import ServiceRepository from '@DALRepositories/ServiceRepository'
// SERVICES
import UploadService from '@Services/UploadService'

@inject()
export default class ServiceService implements ServiceServiceInterface {
  private serviceRepository: ServiceRepository
  private readonly pictoPath = 'services/pictos/'
  private readonly imagePath = 'services/images/'

  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository
  }

  public async listServicesByProfession(professionId: number) {
    return await this.serviceRepository.listServicesByProfession(professionId)
  }

  public async listPublicServicesByProfession(professionId: number) {
    return await this.serviceRepository.listPublicServicesByProfession(professionId)
  }

  public async getServiceById(id: number) {
    return await this.serviceRepository.getServiceById(id)
  }

  public async getPublicServiceById(id: number) {
    return await this.serviceRepository.getPublicServiceById(id)
  }

  public async createService(
    data: ServiceCreateOrUpdateDTO,
    pictoFile: MultipartFileContract | null = null,
    imageFile: MultipartFileContract | null = null
  ) {
    if (pictoFile) {
      data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name)
    }

    if (imageFile) {
      data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name)
    }
    return await this.serviceRepository.createService(data)
  }

  public async updateServiceById(
    idToUpdate: number,
    data: ServiceCreateOrUpdateDTO,
    pictoFile: MultipartFileContract | null = null,
    imageFile: MultipartFileContract | null = null
  ) {
    const oldService = await this.serviceRepository.getServiceById(idToUpdate)
    if (pictoFile || imageFile) {
      if (pictoFile) {
        if (oldService.picto_file) {
          await UploadService.deleteFile(oldService.picto_file)
        }
        data.picto_file = await UploadService.uploadFileTo(pictoFile, this.pictoPath, data.name)
      }
      if (imageFile) {
        if (oldService.image_file) {
          await UploadService.deleteFile(oldService.image_file)
        }
        data.image_file = await UploadService.uploadFileTo(imageFile, this.imagePath, data.name)
      }
    }

    if (oldService.name !== data.name && oldService.picto_file && !pictoFile) {
      data.picto_file = await UploadService.renameFile(oldService.picto_file, data.name)
    }
    if (oldService.name !== data.name && oldService.image_file && !imageFile) {
      data.image_file = await UploadService.renameFile(oldService.image_file, data.name)
    }
    return await this.serviceRepository.updateServiceById(idToUpdate, data)
  }

  public async updateServiceStatusById(idToUpdate: number, data: ServiceStatusUpdateDTO) {
    return await this.serviceRepository.updateServiceStatusById(idToUpdate, data)
  }

  public async deleteServicePicto(idToDelete: number) {
    const serviceToDelete = await this.serviceRepository.getServiceById(idToDelete)
    if (serviceToDelete.picto_file) {
      await UploadService.deleteFile(serviceToDelete.picto_file)
    }
    return await this.serviceRepository.deleteServicePicto(idToDelete)
  }

  public async deleteServiceImage(idToDelete: number) {
    const serviceToDelete = await this.serviceRepository.getServiceById(idToDelete)
    if (serviceToDelete.image_file) {
      await UploadService.deleteFile(serviceToDelete.image_file)
    }
    return await this.serviceRepository.deleteServiceImage(idToDelete)
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
