import { SigninController } from './signin.controller'
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
  UnauthorizedError
} from '../../errors'

class AuthUseCaseStub {
  accessToken = 'valid_token'
  async auth (email, password) {
    this.email = email
    this.password = password
    return this.accessToken
  }
}

const makeAuthUseCaseStub = () => new AuthUseCaseStub()

class EmailValidatorStub {
  isEmailValid = true
  isValid (email) {
    this.email = email
    return this.isEmailValid
  }
}

const makeEmailValidator = () => new EmailValidatorStub()

const makeSut = () => {
  const authUseCaseStub = makeAuthUseCaseStub()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SigninController(authUseCaseStub, emailValidatorStub)
  return {
    sut,
    authUseCaseStub,
    emailValidatorStub
  }
}

describe('Signin Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authUseCaseStub.email).toBe(httpRequest.body.email)
    expect(authUseCaseStub.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseStub } = makeSut()
    authUseCaseStub.accessToken = null
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 500 if no AuthUseCase is provided', async () => {
    const sut = new SigninController()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AuthUseCase has no auth method', async () => {
    const sut = new SigninController({})
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid@email.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBe(authUseCaseStub.accessToken)
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    emailValidatorStub.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if no EmailValidator is provided', async () => {
    const authUseCaseStub = makeAuthUseCaseStub()
    const sut = new SigninController(authUseCaseStub)
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if EmailValidator has no isValid method', async () => {
    const authUseCaseStub = makeAuthUseCaseStub()
    const sut = new SigninController(authUseCaseStub, {})
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should throw when AuthUseCase throws', async () => {
    const authUseCaseStub = makeAuthUseCaseStub()
    const emailValidatorStub = makeEmailValidator()
    jest.spyOn(authUseCaseStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const sut = new SigninController(authUseCaseStub, emailValidatorStub)
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should throw when EmailValidator throws', async () => {
    const authUseCaseStub = makeAuthUseCaseStub()
    const emailValidatorStub = makeEmailValidator()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const sut = new SigninController(authUseCaseStub, emailValidatorStub)
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
