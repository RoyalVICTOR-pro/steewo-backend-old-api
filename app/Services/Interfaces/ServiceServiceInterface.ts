import Service from '@Models/Service'
import { ServiceCreateOrUpdateDTO } from '@DTO/ServiceCreateOrUpdateDTO'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export default interface ServiceServiceInterface {
  listServicesByProfession(professionId: number): Promise<Service[]>
  getServiceById(id: number): Promise<Service>
  createService(
    data: ServiceCreateOrUpdateDTO,
    pictoFile: MultipartFileContract,
    imageFile: MultipartFileContract
  ): Promise<Service>
  updateServiceById(idToUpdate: number, data: ServiceCreateOrUpdateDTO): Promise<Service>
  deleteService(id: number): Promise<boolean>
}
