import Profession from 'App/Models/Profession'
import Service from 'App/Models/Service'
import FormField from 'App/Models/FormField'

export const hardDeleteProfession = async (idToDelete: number) => {
  await Profession.query().where('id', idToDelete).delete()
}

export const hardDeleteService = async (idToDelete: number) => {
  await Service.query().where('id', idToDelete).delete()
}

export const hardDeleteFormField = async (idToDelete: number) => {
  await FormField.query().where('id', idToDelete).delete()
}
