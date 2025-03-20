export class CannotGetWogiProductsError extends Error {
  constructor(userName: string) {
    super(`Cannot get Wogi products with user name ${userName}`);
  }
}
