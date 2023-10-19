import Profession from 'App/Models/Profession'
import { ProfessionCreateOrUpdateDTO } from '@DTO/ProfessionCreateOrUpdateDTO'

export default interface ProfessionServiceInterface {
  listProfessions(): Promise<Profession[]>
  getProfessionById(id: number): Promise<Profession>
  createProfession(data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  updateProfession(data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  deleteProfession(id: number): Promise<boolean>
}
