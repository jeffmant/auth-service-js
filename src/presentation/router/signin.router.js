import { HttpResponse } from '../helpers/http.helper'

export class SigninRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest?.body || !this.authUseCase?.auth) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }

    this.authUseCase.auth(email, password)
    return HttpResponse.unauthorizedError()
  }
}
