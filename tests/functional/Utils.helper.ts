import Profession from 'App/Models/Profession'
import Service from 'App/Models/Service'

export const hardDeleteProfession = async (idToDelete: number) => {
  await Profession.query().where('id', idToDelete).delete()
}

export const hardDeleteService = async (idToDelete: number) => {
  await Service.query().where('id', idToDelete).delete()
}
