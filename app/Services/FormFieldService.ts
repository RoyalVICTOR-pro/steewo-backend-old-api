import { FormFieldCreateOrUpdateDTO } from '@DTO/FormFieldCreateOrUpdateDTO'
import { inject } from '@adonisjs/core/build/standalone'
import FormFieldServiceInterface from '@Services/Interfaces/FormFieldServiceInterface'
import { FormFieldRepository } from '@DALRepositories/FormFieldRepository'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import UploadService from '@Services/UploadService'
import { FormFieldUpdateOrderDTO } from '@DTO/FormFieldUpdateOrderDTO'

@inject()
export class FormFieldService implements FormFieldServiceInterface {
  private formFieldRepository: FormFieldRepository
  private readonly tooltipImagePath = 'form-fields/tooltip-images/'

  constructor(formFieldRepository: FormFieldRepository) {
    this.formFieldRepository = formFieldRepository
  }

  public async listFormFieldsByService(serviceId: number) {
    return await this.formFieldRepository.listFormFieldsByService(serviceId)
  }

  public async getFormFieldById(id: number) {
    return await this.formFieldRepository.getFormFieldById(id)
  }

  public async createFormField(
    data: FormFieldCreateOrUpdateDTO,
    tooltip_image_file: MultipartFileContract | null = null
  ) {
    if (tooltip_image_file) {
      data.tooltip_image_file = await UploadService.uploadFileTo(
        tooltip_image_file,
        this.tooltipImagePath,
        data.label
      )
    }
    return await this.formFieldRepository.createFormField(data)
  }

  public async updateFormFieldById(
    idToUpdate: number,
    data: FormFieldCreateOrUpdateDTO,
    tooltip_image_file: MultipartFileContract | null = null
  ) {
    const oldFormField = await this.formFieldRepository.getFormFieldById(idToUpdate)
    if (tooltip_image_file) {
      if (oldFormField.tooltip_image_file) {
        await UploadService.deleteFile(oldFormField.tooltip_image_file)
      }
      data.tooltip_image_file = await UploadService.uploadFileTo(
        tooltip_image_file,
        this.tooltipImagePath,
        data.label
      )
    }

    if (
      oldFormField.label !== data.label &&
      oldFormField.tooltip_image_file &&
      !tooltip_image_file
    ) {
      data.tooltip_image_file = await UploadService.renameFile(
        oldFormField.tooltip_image_file,
        data.label
      )
    }
    return await this.formFieldRepository.updateFormFieldById(idToUpdate, data)
  }

  public async updateFormFieldOrder(reorderedFormFields: FormFieldUpdateOrderDTO[]) {
    return await this.formFieldRepository.updateFormFieldOrder(reorderedFormFields)
  }

  public async deleteFormFieldTooltipImage(idToDelete: number) {
    const formFieldToDelete = await this.formFieldRepository.getFormFieldById(idToDelete)
    if (formFieldToDelete.tooltip_image_file) {
      await UploadService.deleteFile(formFieldToDelete.tooltip_image_file)
    }
    return await this.formFieldRepository.deleteFormFieldTooltipImage(idToDelete)
  }

  public async deleteFormField(idToDelete: number) {
    const formFieldToDelete = await this.formFieldRepository.getFormFieldById(idToDelete)

    if (formFieldToDelete.tooltip_image_file) {
      await UploadService.deleteFile(formFieldToDelete.tooltip_image_file)
    }
    return await this.formFieldRepository.deleteFormField(idToDelete)
  }
}
