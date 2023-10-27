import Profession from 'App/Models/Profession'
import { ProfessionCreateOrUpdateDTO } from '@DTO/ProfessionCreateOrUpdateDTO'

export default interface ProfessionRepositoryInterface {
  listProfessions(): Promise<Profession[]>
  getProfessionById(id: number): Promise<Profession>
  createProfession(data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  updateProfessionById(idToUpdate: number, data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  deleteProfession(id: number): Promise<boolean>
}
