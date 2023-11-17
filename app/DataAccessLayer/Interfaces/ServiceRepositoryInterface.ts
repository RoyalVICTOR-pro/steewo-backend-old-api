import Service from '@Models/Service'
import { ServiceCreateOrUpdateDTO } from '@DTO/ServiceCreateOrUpdateDTO'

export default interface ServiceInterface {
  listServicesByProfession(professionId: number): Promise<Service[]>
  getServiceById(id: number): Promise<Service>
  createService(data: ServiceCreateOrUpdateDTO): Promise<Service>
  updateServiceById(idToUpdate: number, data: ServiceCreateOrUpdateDTO): Promise<Service>
  deleteService(id: number): Promise<boolean>
}
