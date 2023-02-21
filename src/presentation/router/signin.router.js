export default class SigninRouter {
  route (httpRequest) {
    const { email } = httpRequest
    if (!email) {
      return {
        statusCode: 400
      }
    }
  }
}
