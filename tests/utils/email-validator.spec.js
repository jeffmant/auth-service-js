import { EmailValidator } from '../../src/utils/email-validator'

describe('Email Validator', () => {
  test('Should return true if validator returns true', async () => {
    const sut = new EmailValidator()
    const isValid = await sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })
})
