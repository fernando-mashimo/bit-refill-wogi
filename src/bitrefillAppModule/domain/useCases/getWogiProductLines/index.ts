import { CannotGetWogiProductLinesError } from "../../errors/cannotGetWogiProductLinesError";
import { IWogi, WogiProductLines } from "../../services/wogi";
import { UseCase } from "../common/useCase";
import { GetWogiProductLinesUseCaseInput } from "./input";

export class GetWogiProductLinesUseCase
  implements UseCase<GetWogiProductLinesUseCaseInput, WogiProductLines>
{
  private wogi: IWogi;

  constructor(wogi: IWogi) {
    this.wogi = wogi;
  }

  public async execute(
    input: GetWogiProductLinesUseCaseInput
  ): Promise<WogiProductLines> {
    try {
      const productLines = await this.wogi.getProductLines(
        input.userName,
        input.password
      );

      if (!productLines) {
        throw new CannotGetWogiProductLinesError(input.userName);
      }

      return productLines;
    } catch (error) {
      console.error(
        `Cannot get wogi product lines with input ${input.userName}`,
        error
      );
      throw error;
    }
  }
}
