import { inject } from '@adonisjs/core/build/standalone'
import Profession from '@Models/Profession'
import ProfessionCreateOrUpdateDTO from '@DTO/ProfessionCreateOrUpdateDTO'
import ProfessionRepositoryInterface from '@DALInterfaces/ProfessionRepositoryInterface'
import ProfessionStatusUpdateDTO from '@DTO/ProfessionStatusUpdateDTO'

@inject()
export default class ProfessionRepository implements ProfessionRepositoryInterface {
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
    if (data.is_enabled !== undefined) profession.is_enabled = data.is_enabled
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
    if (data.is_enabled !== undefined) profession.is_enabled = data.is_enabled
    await profession.save()
    return profession
  }

  public async updateProfessionStatusById(idToUpdate: number, data: ProfessionStatusUpdateDTO) {
    const profession = await Profession.findOrFail(idToUpdate)
    profession.is_enabled = data.is_enabled
    await profession.save()
    return profession
  }

  public async deleteProfessionPicto(id: number): Promise<boolean> {
    const profession = await Profession.findOrFail(id)
    profession.picto_file = null
    await profession.save()
    return true
  }

  public async deleteProfessionImage(id: number): Promise<boolean> {
    const profession = await Profession.findOrFail(id)
    profession.image_file = null
    await profession.save()
    return true
  }

  public async deleteProfession(id: number): Promise<boolean> {
    const profession = await Profession.findOrFail(id)
    await profession.delete()
    return true
  }
}
