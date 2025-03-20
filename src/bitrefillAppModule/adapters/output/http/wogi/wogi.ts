import {
  IWogi,
  WogiProductLines,
  WogiProducts,
} from "src/bitrefillAppModule/domain/services/wogi";
import { $config } from "../../../../../../lib/config";
import { UnauthorizedError } from "src/bitrefillAppModule/domain/errors/unauthorizedError";
import { ForbiddenError } from "src/bitrefillAppModule/domain/errors/forbiddenError";

export class Wogi implements IWogi {
  private url: URL = new URL($config.WOGI_API_BASE_URL);

  public async getProducts(
    userName: string,
    password: string
  ): Promise<WogiProducts> {
    this.url.pathname = "/api/v1/products";

    try {
      const response = await fetch(this.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${userName}:${password}`
          ).toString("base64")}`,
        },
      });

      await this.verifyErrorAndThrow(response);

      const data: WogiProducts = await response.json();
      return data;
    } catch (error) {
      console.error("Cannot get products from Wogi API", error);
      throw error;
    }
  }

  public async getProductLines(
    userName: string,
    password: string
  ): Promise<WogiProductLines | undefined> {
    this.url.pathname = "/api/v1/product_lines";

    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${userName}:${password}`).toString(
          "base64"
        )}`,
      },
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const text = await response.text();
      throw new Error(`Failed to fetch product lines\n${text}`);
    }

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return undefined;
    }
  }

  private async verifyErrorAndThrow(response: Response): Promise<void> {
    if (response.status === 401) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const text = await response.text();
      console.error(`Server response text:\n${text}`);
      throw new UnauthorizedError(text);
    }

    if (response.status === 403) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const text = await response.text();
      console.error(`Server response text:\n${text}`);
      throw new ForbiddenError(text);
    }
  }
}
