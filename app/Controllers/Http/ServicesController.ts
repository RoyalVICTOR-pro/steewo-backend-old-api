// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// DTO
import ServiceCreateOrUpdateDTO from '@DTO/ServiceCreateOrUpdateDTO'
// SERVICES
import ServiceService from '@Services/ServiceService'
// VALIDATORS
import ServiceCreateValidator from '@Validators/ServiceCreateValidator'
import ServiceStatusUpdateValidator from '@Validators/ServiceStatusUpdateValidator'
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

  public async getAllPublicServicesByProfession({ response, params }: HttpContextContract) {
    const services = await this.serviceService.listPublicServicesByProfession(params.id_profession)
    return response.ok(services)
  }

  public async getServiceById({ response, params }: HttpContextContract) {
    const service = await this.serviceService.getServiceById(params.id)
    return response.ok(service)
  }

  public async getPublicServiceById({ response, params }: HttpContextContract) {
    const service = await this.serviceService.getPublicServiceById(params.id)
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

  public async updateServiceStatus({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ServiceStatusUpdateValidator)
    const updatedServiceStatus = {
      is_enabled: data.is_enabled || false,
    }

    const service = await this.serviceService.updateServiceStatusById(
      params.id,
      updatedServiceStatus
    )
    return response.ok(service)
  }

  public async deleteServicePicto({ response, params }: HttpContextContract) {
    await this.serviceService.deleteServicePicto(params.id)
    return response.noContent()
  }

  public async deleteServiceImage({ response, params }: HttpContextContract) {
    await this.serviceService.deleteServiceImage(params.id)
    return response.noContent()
  }

  public async deleteService({ response, params }: HttpContextContract) {
    await this.serviceService.deleteService(params.id)
    return response.noContent()
  }
}
