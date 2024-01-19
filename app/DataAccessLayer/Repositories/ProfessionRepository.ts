// Générer les méthodes CRUD pour le modèle Profession

import Profession from '@Models/Profession'
import { ProfessionCreateOrUpdateDTO } from '@DTO/ProfessionCreateOrUpdateDTO'
import { ProfessionStatusUpdateDTO } from '@DTO/ProfessionStatusUpdateDTO'
import ProfessionRepositoryInterface from '@DALInterfaces/ProfessionRepositoryInterface'
import { inject } from '@adonisjs/core/build/standalone'

@inject()
export class ProfessionRepository implements ProfessionRepositoryInterface {
  public async listProfessions(): Promise<Profession[]> {
    // const professions = await Profession.all()
    const professions = await Profession.query().orderBy('name', 'asc')
    return professions
  }

  public async getProfessionById(id: number): Promise<Profession> {
    const profession = await Profession.findOrFail(id)
    return profession
  }

  public async createProfession(data: ProfessionCreateOrUpdateDTO): Promise<Profession> {
    const profession = new Profession()
    profession.name = data.name
    if (data.picto_file) profession.picto_file = data.picto_file
    if (data.image_file) profession.image_file = data.image_file
    if (data.is_enabled) profession.is_enabled = data.is_enabled
    await profession.save()
    return profession
  }

  public async updateProfessionById(
    idToUpdate: number,
    data: ProfessionCreateOrUpdateDTO
  ): Promise<Profession> {
    const profession = await Profession.findOrFail(idToUpdate)
    profession.name = data.name
    if (data.picto_file) profession.picto_file = data.picto_file
    if (data.image_file) profession.image_file = data.image_file
    if (data.is_enabled) profession.is_enabled = data.is_enabled
    await profession.save()
    return profession
  }

  public async updateProfessionStatusById(idToUpdate: number, data: ProfessionStatusUpdateDTO) {
    const profession = await Profession.findOrFail(idToUpdate)
    profession.is_enabled = data.is_enabled
    await profession.save()
    return profession
  }

  public async deleteProfession(id: number): Promise<boolean> {
    const profession = await Profession.findOrFail(id)
    await profession.delete()
    return true
  }
}
