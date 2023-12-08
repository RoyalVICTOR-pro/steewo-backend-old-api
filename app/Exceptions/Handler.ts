/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    // TODO : Gérer les messages d'erreurs en fonction de la langue de l'utilisateur
    // console.log('error status :>> ', error.status)
    // console.log('error complète :>> ', error)

    if (error.status === 401) {
      // Gestion des erreurs 404 (Not Found)
      return ctx.response.status(error.status).send({
        message: "Vous n'avez pas accès à cette ressource",
      })
    }

    if (error.status === 404) {
      // Gestion des erreurs 404 (Not Found)
      return ctx.response.status(error.status).send({
        message: 'Ressource introuvable',
      })
    }

    if (error.status === 422) {
      // console.log('error.messages :>> ', JSON.stringify(error.messages))
      // Gestion des erreurs de validation
      return ctx.response.status(error.status).send({
        message: error.messages,
      })
    }

    if (!error.status) {
      // Gestion des erreurs qui n'ont pas de status
      error.status = 500
    }
    // Gestion des autres erreurs
    return ctx.response.status(error.status).send({
      // message: 'Une erreur est survenue, merci de réessayer plus tard',
      message: `Voici le message d'erreur : ${error.message}, voici l'erreur d'origine : ${error.original} et voici l'erreur complète : ${error}`,
    })
  }
}
