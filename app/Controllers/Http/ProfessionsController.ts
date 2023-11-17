import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProfessionCreateOrUpdateDTO } from '@DTO/ProfessionCreateOrUpdateDTO'
import { ProfessionService } from '@Services/ProfessionService'
import ProfessionCreateValidator from '@Validators/ProfessionCreateValidator'
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

  public async getProfessionById({ response, params }: HttpContextContract) {
    const profession = await this.professionService.getProfessionById(params.id)
    return response.ok(profession)
  }

  public async createProfession({ request, response }: HttpContextContract) {
    const data = await request.validate(ProfessionCreateValidator)

    const newProfession: ProfessionCreateOrUpdateDTO = {
      name_fr: data.name_fr,
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
      name_fr: data.name_fr,
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

  public async deleteProfession({ response, params }: HttpContextContract) {
    await this.professionService.deleteProfession(params.id)
    return response.noContent()
  }
}
