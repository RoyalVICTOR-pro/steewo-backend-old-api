import Profession from '@Models/Profession'
import Service from '@Models/Service'
import ServicesFormField from '@Models/ServicesFormField'

export const hardDeleteProfession = async (idToDelete: number) => {
  await Profession.query().where('id', idToDelete).delete()
}

export const hardDeleteService = async (idToDelete: number) => {
  await Service.query().where('id', idToDelete).delete()
}

export const hardDeleteFormField = async (idToDelete: number) => {
  await ServicesFormField.query().where('id', idToDelete).delete()
}
