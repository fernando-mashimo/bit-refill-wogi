export class CannotGetWogiProductLinesError extends Error {
  constructor(userName: string) {
    super(`Cannot get Wogi product lines with user name ${userName}`);
  }
}
