import { EmailValidator } from '../../src/utils/email-validator'
import validator from 'validator'

const makeSut = () => new EmailValidator()

describe('Email Validator', () => {
  test('Should return true if validator returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })

  test('Should return false if validator returns false', async () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isValid = await sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })
})
