import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProfessionService } from 'App/Services/ProfessionService'
import ProfessionCreateOrUpdateValidator from 'App/Validators/ProfessionCreateOrUpdateValidator'

@inject()
export default class ProfessionsController {
  private professionService: ProfessionService
  constructor(professionService: ProfessionService) {
    this.professionService = professionService
  }

  public async getAllProfessions({ response }: HttpContextContract) {
    try {
      const professions = await this.professionService.listProfessions()
      return response.ok(professions)
    } catch (error) {
      error.message = 'While getting all professions : ' + error.message
      console.log(error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  public async getProfessionById({ response, params }: HttpContextContract) {
    try {
      const profession = await this.professionService.getProfessionById(params.id)
      return response.ok(profession)
    } catch (error) {
      error.message = 'While getting profession ' + params.id + ' : ' + error.message
      console.log(error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  public async createProfession({ request, response }: HttpContextContract) {
    try {
      // TODO : S'occuper de l'upoad des images
      const data = await request.validate(ProfessionCreateOrUpdateValidator)
      const newProfession = {
        name_fr: data.name_fr,
        picto_path: data.picto_path,
        image_path: data.image_path,
        is_enabled: data.is_enabled,
      }

      const profession = await this.professionService.createProfession(newProfession)
      return response.created(profession)
    } catch (error) {
      error.message = 'While creating a profession : ' + error.message
      console.log(error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  public async updateProfession({ request, response }: HttpContextContract) {
    const data = request.only(['id', 'name_fr'])
    try {
      const profession = await this.professionService.updateProfession(data)
      return response.ok(profession)
    } catch (error) {
      error.message = 'While updating profession ' + data.id + ' : ' + error.message
      console.log(error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  public async deleteProfession({ response, params }: HttpContextContract) {
    try {
      await this.professionService.deleteProfession(params.id)
      return response.noContent()
    } catch (error) {
      error.message = 'While deleting profession ' + params.id + ' : ' + error.message
      console.log(error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
