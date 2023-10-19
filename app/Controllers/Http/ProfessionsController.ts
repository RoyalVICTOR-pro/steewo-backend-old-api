import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProfessionService } from 'App/Services/ProfessionService'

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
    const data = request.only(['name_fr'])
    const profession = await this.professionService.createProfession(data)
    return response.created(profession)
  }

  public async updateProfession({ request, response }: HttpContextContract) {
    const data = request.only(['id', 'name_fr'])
    const profession = await this.professionService.updateProfession(data)
    return response.ok(profession)
  }

  public async deleteProfession({ response, params }: HttpContextContract) {
    await this.professionService.deleteProfession(params.id)
    return response.noContent()
  }
}
