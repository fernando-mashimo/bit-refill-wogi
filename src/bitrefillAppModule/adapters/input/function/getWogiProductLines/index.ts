import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { Wogi } from "src/bitrefillAppModule/adapters/output/http/wogi/wogi";
import { LambdaHttpResponse } from "../common/httpResponse";
import { UnauthorizedError } from "src/bitrefillAppModule/domain/errors/unauthorizedError";
import { ForbiddenError } from "src/bitrefillAppModule/domain/errors/forbiddenError";
import { GetWogiProductLinesUseCase } from "src/bitrefillAppModule/domain/useCases/getWogiProductLines";
import { GetWogiProductLinesUseCaseInput } from "src/bitrefillAppModule/domain/useCases/getWogiProductLines/input";
import { CannotGetWogiProductLinesError } from "src/bitrefillAppModule/domain/errors/cannotGetWogiProductLinesError";

const wogi = new Wogi();
const getWogiProductLinesUseCase = new GetWogiProductLinesUseCase(wogi);

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const requestParamenters = event.queryStringParameters;

    const getWogiProductLinesUseCaseInput: GetWogiProductLinesUseCaseInput = {
      userName: requestParamenters?.userName ?? "",
      password: requestParamenters?.password ?? "",
    };

    const result = await getWogiProductLinesUseCase.execute(
      getWogiProductLinesUseCaseInput
    );

    return LambdaHttpResponse.success(result);
  } catch (error) {
    if (error instanceof UnauthorizedError)
      return LambdaHttpResponse.error(401, "UNAUTHORIZED", error.message);

    if (error instanceof ForbiddenError)
      return LambdaHttpResponse.error(403, "FORBIDDEN", error.message);

    if (error instanceof CannotGetWogiProductLinesError)
      return LambdaHttpResponse.error(
        422,
        "CANNOT_GET_WOGI_PRODUCT_LINES",
        error.message
      );

    console.error("Cannot handle get wogi products event", error);
    return LambdaHttpResponse.error(500, "INTERNAL_ERROR");
  }
};
