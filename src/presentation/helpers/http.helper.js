import { MissingParamError } from '../errors/missing-param.error'
import { ServerError } from '../errors/server.error'
import { UnauthorizedError } from '../errors/unauthorized.error'

export class HttpResponse {
  static success (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}
