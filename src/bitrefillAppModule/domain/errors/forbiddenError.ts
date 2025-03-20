export class ForbiddenError extends Error {
  constructor(text: string) {
    super(`Forbbidden access to this resource - Server response text: ${text}`);
  } 
}
