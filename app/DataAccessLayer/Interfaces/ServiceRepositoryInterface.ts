import Service from '@Models/Service'
import ServiceCreateOrUpdateDTO from '@DTO/ServiceCreateOrUpdateDTO'
import ServiceStatusUpdateDTO from '@DTO/ServiceStatusUpdateDTO'

export default interface ServiceInterface {
  listServicesByProfession(professionId: number): Promise<Service[]>
  getServiceById(id: number): Promise<Service>
  createService(data: ServiceCreateOrUpdateDTO): Promise<Service>
  updateServiceById(idToUpdate: number, data: ServiceCreateOrUpdateDTO): Promise<Service>
  updateServiceStatusById(idToUpdate: number, data: ServiceStatusUpdateDTO): Promise<Service>
  deleteServicePicto(id: number): Promise<boolean>
  deleteServiceImage(id: number): Promise<boolean>
  deleteService(id: number): Promise<boolean>
}
