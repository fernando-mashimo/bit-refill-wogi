import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { Wogi } from "src/bitrefillAppModule/adapters/output/http/wogi/wogi";
import { GetWogiProductsUseCase } from "src/bitrefillAppModule/domain/useCases/getWogiProducts";
import { LambdaHttpResponse } from "../common/httpResponse";
import { CannotGetWogiProductsError } from "src/bitrefillAppModule/domain/errors/cannotGetWogiProductsError";
import { GetWogiProductsUseCaseInput } from "src/bitrefillAppModule/domain/useCases/getWogiProducts/input";
import { UnauthorizedError } from "src/bitrefillAppModule/domain/errors/unauthorizedError";
import { ForbiddenError } from "src/bitrefillAppModule/domain/errors/forbiddenError";

const wogi = new Wogi();
const getWogiProductsUseCase = new GetWogiProductsUseCase(wogi);

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const requestParamenters = event.queryStringParameters;

    const getWogiProductsUseCaseInput: GetWogiProductsUseCaseInput = {
      userName: requestParamenters?.userName ?? "",
      password: requestParamenters?.password ?? "",
    };

    const result = await getWogiProductsUseCase.execute(
      getWogiProductsUseCaseInput
    );

    return LambdaHttpResponse.success(result);
  } catch (error) {
    if (error instanceof UnauthorizedError)
      return LambdaHttpResponse.error(401, "UNAUTHORIZED", error.message);

    if (error instanceof ForbiddenError)
      return LambdaHttpResponse.error(403, "FORBIDDEN", error.message);

    if (error instanceof CannotGetWogiProductsError)
      return LambdaHttpResponse.error(
        422,
        "CANNOT_GET_WOGI_PRODUCTS",
        error.message
      );

    console.error("Cannot handle get wogi products event", error);
    return LambdaHttpResponse.error(500, "INTERNAL_ERROR");
  }
};
