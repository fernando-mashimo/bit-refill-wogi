import { IllegalArgumentError } from "../../../../domain/errors/illegalArgumentError";
import { InputValidator } from "../common/validator";
import { CreateCustomerEvent } from "./input";

export const validateInput = (input: CreateCustomerEvent): void => {
  if (!InputValidator.isFilledString(input.name))
    throw new IllegalArgumentError("Invalid name provided");

  if (!InputValidator.isValidMail(input.email))
    throw new IllegalArgumentError("Invalid email provided");

  if (!InputValidator.isNumeric(input.phone))
    throw new IllegalArgumentError("Invalid phone provided");

  if (!InputValidator.isFilledString(input.address))
    throw new IllegalArgumentError("Invalid address provided");
};
