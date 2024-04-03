// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import ProfessionCreateOrUpdateDTO from '@DTO/ProfessionCreateOrUpdateDTO'
import ProfessionRepositoryInterface from '@DALInterfaces/ProfessionRepositoryInterface'
import ProfessionStatusUpdateDTO from '@DTO/ProfessionStatusUpdateDTO'
// MODELS
import Profession from '@Models/Profession'

@inject()
export default class ProfessionRepository implements ProfessionRepositoryInterface {
  public async listProfessions(): Promise<Profession[]> {
    // const professions = await Profession.all()
    const professions = await Profession.query().orderBy('name', 'asc')
    return professions
  }

  public async listPublicProfessions(): Promise<Profession[]> {
    const professions = await Profession.query().where('is_enabled', true).orderBy('name', 'asc')
    return professions
  }

  public async getProfessionById(id: number): Promise<Profession> {
    const profession = await Profession.findOrFail(id)
    return profession
  }

  public async getPublicProfessionById(id: number): Promise<Profession> {
    const profession = await Profession.query()
      .where('is_enabled', true)
      .where('id', id)
      .firstOrFail()
    return profession
  }

  public async createProfession(data: ProfessionCreateOrUpdateDTO): Promise<Profession> {
    const profession = new Profession()
    profession.merge(data)
    await profession.save()
    return profession
  }

  public async updateProfessionById(
    idToUpdate: number,
    data: ProfessionCreateOrUpdateDTO
  ): Promise<Profession> {
    const profession = await Profession.findOrFail(idToUpdate)
    profession.merge(data)
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
