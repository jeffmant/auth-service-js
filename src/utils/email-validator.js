import validator from 'validator'

export class EmailValidator {
  async isValid (email) {
    return validator.isEmail(email)
  }
}
