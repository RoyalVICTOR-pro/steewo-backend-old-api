import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Profession from '@Models/Profession'
import ProfessionCreateOrUpdateDTO from '@DTO/ProfessionCreateOrUpdateDTO'
import ProfessionStatusUpdateDTO from '@DTO/ProfessionStatusUpdateDTO'

export default interface ProfessionServiceInterface {
  listProfessions(): Promise<Profession[]>
  getProfessionById(id: number): Promise<Profession>
  createProfession(
    data: ProfessionCreateOrUpdateDTO,
    pictoFile: MultipartFileContract,
    imageFile: MultipartFileContract
  ): Promise<Profession>
  updateProfessionById(idToUpdate: number, data: ProfessionCreateOrUpdateDTO): Promise<Profession>
  updateProfessionStatusById(
    idToUpdate: number,
    data: ProfessionStatusUpdateDTO
  ): Promise<Profession>
  deleteProfession(id: number): Promise<boolean>
  deleteProfessionPicto(id: number): Promise<boolean>
  deleteProfessionImage(id: number): Promise<boolean>
}
