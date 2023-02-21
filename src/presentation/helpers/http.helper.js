export class HttpResponse {
  static badRequest () {
    return {
      statusCode: 400
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}
