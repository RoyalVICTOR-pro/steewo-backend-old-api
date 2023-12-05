// Générer les méthodes CRUD pour le modèle Service

import Service from '@Models/Service'
import { ServiceCreateOrUpdateDTO } from '@DTO/ServiceCreateOrUpdateDTO'
import ServiceRepositoryInterface from '@DALInterfaces/ServiceRepositoryInterface'
import { inject } from '@adonisjs/core/build/standalone'

@inject()
export class ServiceRepository implements ServiceRepositoryInterface {
  public async listServicesByProfession(professionId: number): Promise<Service[]> {
    const services = await Service.query().where('profession_id', professionId).orderBy('name')
    return services
  }

  public async getServiceById(id: number): Promise<Service> {
    const service = await Service.findOrFail(id)
    return service
  }

  public async createService(data: ServiceCreateOrUpdateDTO): Promise<Service> {
    const service = new Service()
    service.name = data.name
    service.short_name = data.short_name
    service.profession_id = data.profession_id
    if (data.picto_file) service.picto_file = data.picto_file
    if (data.image_file) service.image_file = data.image_file
    if (data.is_enabled) service.is_enabled = data.is_enabled
    await service.save()
    return service
  }

  public async updateServiceById(
    idToUpdate: number,
    data: ServiceCreateOrUpdateDTO
  ): Promise<Service> {
    const service = await Service.findOrFail(idToUpdate)
    service.name = data.name
    service.short_name = data.short_name
    service.profession_id = data.profession_id
    if (data.picto_file) service.picto_file = data.picto_file
    if (data.image_file) service.image_file = data.image_file
    if (data.is_enabled) service.is_enabled = data.is_enabled
    await service.save()
    return service
  }

  public async deleteService(id: number): Promise<boolean> {
    const service = await Service.findOrFail(id)
    await service.delete()
    return true
  }
}
