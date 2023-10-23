import Profession from 'App/Models/Profession'
import { ProfessionCreateOrUpdateDTO } from '@DTO/ProfessionCreateOrUpdateDTO'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export default interface ProfessionServiceInterface {
  listProfessions(): Promise<Profession[]>
  getProfessionById(id: number): Promise<Profession>
  createProfession(
    data: ProfessionCreateOrUpdateDTO,
    pictoFile: MultipartFileContract,
    imageFile: MultipartFileContract
  ): Promise<Profession>
  updateProfessionById(idToUpdate: number, data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  deleteProfession(id: number): Promise<boolean>
}
