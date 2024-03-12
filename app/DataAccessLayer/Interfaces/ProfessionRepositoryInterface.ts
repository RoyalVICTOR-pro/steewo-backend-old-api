import Profession from '@Models/Profession'
import ProfessionCreateOrUpdateDTO from '@DTO/ProfessionCreateOrUpdateDTO'
import ProfessionStatusUpdateDTO from '@DTO/ProfessionStatusUpdateDTO'

export default interface ProfessionRepositoryInterface {
  listProfessions(): Promise<Profession[]>
  getProfessionById(id: number): Promise<Profession>
  createProfession(data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  updateProfessionById(idToUpdate: number, data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  updateProfessionStatusById(
    idToUpdate: number,
    data: ProfessionStatusUpdateDTO
  ): Promise<Profession>
  deleteProfessionPicto(id: number): Promise<boolean>
  deleteProfessionImage(id: number): Promise<boolean>
  deleteProfession(id: number): Promise<boolean>
}
