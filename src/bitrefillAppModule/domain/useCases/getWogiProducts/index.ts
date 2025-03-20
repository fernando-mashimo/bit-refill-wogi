import { CannotGetWogiProductsError } from "../../errors/cannotGetWogiProductsError";
import { IWogi, WogiProducts } from "../../services/wogi";
import { UseCase } from "../common/useCase";
import { GetWogiProductsUseCaseInput } from "./input";

export class GetWogiProductsUseCase
  implements UseCase<GetWogiProductsUseCaseInput, WogiProducts>
{
  private wogi: IWogi;

  constructor(wogi: IWogi) {
    this.wogi = wogi;
  }

  public async execute(
    input: GetWogiProductsUseCaseInput
  ): Promise<WogiProducts> {
    try {
      const products = await this.wogi.getProducts(
        input.userName,
        input.password
      );

      if (!products) {
        throw new CannotGetWogiProductsError(input.userName);
      }

      return products;
    } catch (error) {
      console.error(
        `Cannot get wogi products with input ${input.userName}`,
        error
      );
      throw error;
    }
  }
}
