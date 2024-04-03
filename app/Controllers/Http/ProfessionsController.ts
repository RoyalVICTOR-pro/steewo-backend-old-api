// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// DTO
import ProfessionCreateOrUpdateDTO from '@DTO/ProfessionCreateOrUpdateDTO'
// SERVICES
import ProfessionService from '@Services/ProfessionService'
// VALIDATORS
import ProfessionCreateValidator from '@Validators/ProfessionCreateValidator'
import ProfessionUpdateStatusValidator from '@Validators/ProfessionUpdateStatusValidator'
import ProfessionUpdateValidator from '@Validators/ProfessionUpdateValidator'

@inject()
export default class ProfessionsController {
  private professionService: ProfessionService
  constructor(professionService: ProfessionService) {
    this.professionService = professionService
  }

  public async getAllProfessions({ response }: HttpContextContract) {
    const professions = await this.professionService.listProfessions()
    return response.ok(professions)
  }

  public async getAllPublicProfessions({ response }: HttpContextContract) {
    const professions = await this.professionService.listPublicProfessions()
    return response.ok(professions)
  }

  public async getProfessionById({ response, params }: HttpContextContract) {
    const profession = await this.professionService.getProfessionById(params.id)
    return response.ok(profession)
  }

  public async getPublicProfessionById({ response, params }: HttpContextContract) {
    const profession = await this.professionService.getPublicProfessionById(params.id)
    return response.ok(profession)
  }

  public async createProfession({ request, response }: HttpContextContract) {
    const data = await request.validate(ProfessionCreateValidator)

    const newProfession: ProfessionCreateOrUpdateDTO = {
      name: data.name,
      is_enabled: data.is_enabled,
    }

    const profession = await this.professionService.createProfession(
      newProfession,
      data.picto_file,
      data.image_file
    )
    return response.created(profession)
  }

  public async updateProfession({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ProfessionUpdateValidator)
    const newProfession = {
      name: data.name,
      is_enabled: data.is_enabled,
    }

    const profession = await this.professionService.updateProfessionById(
      params.id,
      newProfession,
      data.picto_file,
      data.image_file
    )
    return response.ok(profession)
  }

  public async updateProfessionStatus({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ProfessionUpdateStatusValidator)
    const updatedStatus = {
      is_enabled: data.is_enabled || false,
    }

    const profession = await this.professionService.updateProfessionStatusById(
      params.id,
      updatedStatus
    )
    return response.ok(profession)
  }

  public async deleteProfessionPicto({ response, params }: HttpContextContract) {
    await this.professionService.deleteProfessionPicto(params.id)
    return response.noContent()
  }

  public async deleteProfessionImage({ response, params }: HttpContextContract) {
    await this.professionService.deleteProfessionImage(params.id)
    return response.noContent()
  }

  public async deleteProfession({ response, params }: HttpContextContract) {
    await this.professionService.deleteProfession(params.id)
    return response.noContent()
  }
}
