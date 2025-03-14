import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { LambdaHttpResponse } from "../common/httpResponse";
import { CreateCustomerUseCase } from "../../../../domain/useCases/createCustomer";
import { CustomerData } from "../../../output/database/customer/customer";
import { CreateCustomerUseCaseInput } from "../../../../domain/useCases/createCustomer/input";
import { Parser } from "../common/parser";
import { CreateCustomerEvent } from "./input";
import { validateInput } from "./validateInput";
import { IllegalArgumentError } from "../../../../domain/errors/illegalArgumentError";
import { UserAlreadyExistsError } from "../../../../domain/errors/userAlreadyExistsError";

const customerRepository = new CustomerData();
const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = Parser.parseAPIGatewayBody<CreateCustomerEvent>(
      event.body || "",
      event.isBase64Encoded
    );
    validateInput(body);

    const createCustomerUseCaseInput: CreateCustomerUseCaseInput = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
    };

    const result = await createCustomerUseCase.execute(
      createCustomerUseCaseInput
    );

    return LambdaHttpResponse.created(result);
  } catch (error) {
    if (error instanceof IllegalArgumentError)
      return LambdaHttpResponse.error(400, "INVALID_INPUT", error.message);

    if (error instanceof UserAlreadyExistsError)
      return LambdaHttpResponse.error(422, "USER_ALREADY_EXISTS", error.message);

    console.error("Cannot handle create customer event", error);
    return LambdaHttpResponse.error(500, "INTERNAL_ERROR");
  }
};
