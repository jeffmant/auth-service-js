import SigninRouter from './signin.router'

describe('Signin Router', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new SigninRouter()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
