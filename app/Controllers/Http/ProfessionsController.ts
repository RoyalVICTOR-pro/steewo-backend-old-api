import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProfessionCreateOrUpdateDTO } from 'App/DataAccessLayer/DTO/ProfessionCreateOrUpdateDTO'
import { ProfessionService } from 'App/Services/ProfessionService'
import ProfessionCreateValidator from 'App/Validators/ProfessionCreateValidator'
import ProfessionUpdateValidator from 'App/Validators/ProfessionUpdateValidator'

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
      console.log('error.status :>> ', error.status)
      error.message = 'While getting all professions : ' + error.message
      console.log('error :>> ', error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  public async getProfessionById({ response, params }: HttpContextContract) {
    try {
      const profession = await this.professionService.getProfessionById(params.id)
      return response.ok(profession)
    } catch (error) {
      console.log('error.status :>> ', error.status)
      error.message = 'While getting profession ' + params.id + ' : ' + error.message
      console.log('error :>> ', error)
      if (error.status === 404) {
        return response.status(404).json({ message: 'Profession not found' })
      } else {
        return response.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }

  public async createProfession({ request, response }: HttpContextContract) {
    try {
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
    } catch (error) {
      console.log('error.status :>> ', error.status)
      if (error.status === 422) {
        const validationErrorMessagesForConsoleLog = JSON.stringify(error.messages)
        error.message = `Validation Error While creating profession : ${validationErrorMessagesForConsoleLog} =>  ${error.message}`
        console.log('error :>> ', error)
        return response.status(422).json({ message: error.messages })
      } else {
        error.message = `Not a validation error => ${error.message}`
        console.log('error :>> ', error)
        return response.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }

  public async updateProfession({ request, response, params }: HttpContextContract) {
    try {
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
    } catch (error) {
      console.log('error.status :>> ', error.status)
      if (error.status === 422) {
        const validationErrorMessagesForConsoleLog = JSON.stringify(error.messages)
        error.message = `Validation Error While updating profession ${params.id} : ${validationErrorMessagesForConsoleLog} =>  ${error.message}`
        console.log('error :>> ', error)
        return response.status(422).json({ message: error.messages })
      } else if (error.status === 404) {
        error.message = 'While getting profession ' + params.id + ' for update : ' + error.message
        console.log('error :>> ', error)
        return response.status(404).json({ message: 'Profession not found' })
      } else {
        error.message = `Not a validation error => ${error.message}`
        console.log('error :>> ', error)
        return response.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }

  public async deleteProfession({ response, params }: HttpContextContract) {
    try {
      await this.professionService.deleteProfession(params.id)
      return response.noContent()
    } catch (error) {
      console.log('error.status :>> ', error.status)
      if (error.status === 404) {
        error.message = 'While getting profession ' + params.id + ' for delete : ' + error.message
        console.log('error :>> ', error)
        return response.status(404).json({ message: 'Profession not found' })
      } else {
        error.message = 'While deleting profession ' + params.id + ' : ' + error.message
        console.log(error)
        return response.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }
}
