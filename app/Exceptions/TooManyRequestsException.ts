// app/Exceptions/TooManyRequestsException.ts

import { Exception } from '@adonisjs/core/build/standalone'

export default class TooManyRequestsException extends Exception {
  constructor() {
    super('Too many login attempts. Please try again later.', 429)
  }
}
