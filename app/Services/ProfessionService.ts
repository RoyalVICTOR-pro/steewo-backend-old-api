import { ProfessionCreateOrUpdateDTO } from 'App/DataAccessLayer/DTO/ProfessionCreateOrUpdateDTO'
import { inject } from '@adonisjs/core/build/standalone'
import ProfessionServiceInterface from 'App/Services/Interfaces/ProfessionServiceInterface'
import { ProfessionRepository } from 'App/DataAccessLayer/Repositories/ProfessionRepository'

@inject()
export class ProfessionService implements ProfessionServiceInterface {
  private professionRepository: ProfessionRepository
  constructor(professionRepository: ProfessionRepository) {
    this.professionRepository = professionRepository
  }

  public async listProfessions() {
    return await this.professionRepository.listProfessions()
  }

  public async getProfessionById(id: number) {
    return await this.professionRepository.getProfessionById(id)
  }

  public async createProfession(data: ProfessionCreateOrUpdateDTO) {
    return await this.professionRepository.createProfession(data)
  }

  public async updateProfessionById(idToUpdate: number, data: ProfessionCreateOrUpdateDTO) {
    return await this.professionRepository.updateProfessionById(idToUpdate, data)
  }

  public async deleteProfession(id: number) {
    return await this.professionRepository.deleteProfession(id)
  }
}
