import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class RoleMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, roles: string[]) {
    /* 
    Lorsque le serveur reçoit la requête, le garde 'api' extrait le token d'API de l'en-tête `Authorization` de la requête.
    Le garde 'api' cherche ensuite dans la base de données un token qui correspond au token extrait de la requête. 
    Si un tel token est trouvé, le garde 'api' récupère l'utilisateur associé à ce token et le considère comme l'utilisateur authentifié pour cette requête.
    Le garde 'api' stocke ensuite l'utilisateur authentifié dans `auth.user`. 
    On peut donc accéder à `auth.user` dans les contrôleurs ou les middlewares pour obtenir l'utilisateur authentifié pour la requête en cours.
    */
    const user = auth.user

    /* 
    Les paramètres de l'appel au middleware sont forcément passés dans le tableau roles sous la forme d'une chaîne de caractères
    C'est pour cela qu'il faut convertir le rôle de l'utilisateur en chaîne de caractères pour pouvoir le comparer avec les rôles passés en paramètre
    */

    if (user && roles.includes(String(user.role))) {
      await next()
    } else {
      throw new AuthenticationException('Accès non autorisé', 'E_UNAUTHORIZED_ACCESS')
    }
  }
}
