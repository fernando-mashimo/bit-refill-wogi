export class UnauthorizedError extends Error {
  constructor(text: string) {
    super(`Unauthorized access to this resource - Server response text: ${text}`);
  }
}