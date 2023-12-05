import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServiceCreateOrUpdateDTO } from '@DTO/ServiceCreateOrUpdateDTO'
import { ServiceService } from '@Services/ServiceService'
import ServiceCreateValidator from '@Validators/ServiceCreateValidator'
import ServiceUpdateValidator from '@Validators/ServiceUpdateValidator'

@inject()
export default class ServicesController {
  private serviceService: ServiceService
  constructor(serviceService: ServiceService) {
    this.serviceService = serviceService
  }

  public async getAllServicesByProfession({ response, params }: HttpContextContract) {
    const services = await this.serviceService.listServicesByProfession(params.id_profession)
    return response.ok(services)
  }

  public async getServiceById({ response, params }: HttpContextContract) {
    const service = await this.serviceService.getServiceById(params.id)
    return response.ok(service)
  }

  public async createService({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ServiceCreateValidator)

    const newService: ServiceCreateOrUpdateDTO = {
      name: data.name,
      short_name: data.short_name,
      is_enabled: data.is_enabled,
      profession_id: params.id_profession,
    }

    const service = await this.serviceService.createService(
      newService,
      data.picto_file,
      data.image_file
    )
    return response.created(service)
  }

  public async updateService({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ServiceUpdateValidator)
    const updatedService = {
      name: data.name,
      short_name: data.short_name,
      is_enabled: data.is_enabled,
      profession_id: params.id_profession,
    }

    const service = await this.serviceService.updateServiceById(
      params.id,
      updatedService,
      data.picto_file,
      data.image_file
    )
    return response.ok(service)
  }

  public async deleteService({ response, params }: HttpContextContract) {
    await this.serviceService.deleteService(params.id)
    return response.noContent()
  }
}
