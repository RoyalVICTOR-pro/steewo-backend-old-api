// Générer les méthodes CRUD pour le modèle Service

import Service from 'App/Models/Service'
import { ServiceCreateOrUpdateDTO } from 'App/DataAccessLayer/DTO/ServiceCreateOrUpdateDTO'
import ServiceRepositoryInterface from 'App/DataAccessLayer/Interfaces/ServiceRepositoryInterface'
import { inject } from '@adonisjs/core/build/standalone'

@inject()
export class ServiceRepository implements ServiceRepositoryInterface {
  public async listServicesByProfession(professionId: number): Promise<Service[]> {
    const services = await Service.query().where('profession_id', professionId).orderBy('name_fr')
    return services
  }

  public async getServiceById(id: number): Promise<Service> {
    const service = await Service.findOrFail(id)
    return service
  }

  public async createService(data: ServiceCreateOrUpdateDTO): Promise<Service> {
    const service = new Service()
    service.name_fr = data.name_fr
    service.short_name_fr = data.short_name_fr
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
    service.name_fr = data.name_fr
    service.short_name_fr = data.short_name_fr
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
