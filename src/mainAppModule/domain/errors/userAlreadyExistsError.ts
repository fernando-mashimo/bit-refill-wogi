export class UserAlreadyExistsError extends Error {
  constructor(mail: string) {
    super(`User with email ${mail} already exists`);
  }
}
