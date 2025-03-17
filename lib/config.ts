class Config {
  public static AWS_REGION: string = "us-east-1";
  public static AWS_ACCOUNT_ID: string = "577638400961";

  public static DOMAIN_NAME: string = "mashimo.dev.br";
  public static STORE_API_GATEWAY_NAME: string = `store-app.${this.DOMAIN_NAME}`;
}

export const $config = Config;
