import { HttpResponse } from '../helpers/http.helper'

export class SigninRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body
    if (!email || !password) {
      return HttpResponse.badRequest()
    }
  }
}
