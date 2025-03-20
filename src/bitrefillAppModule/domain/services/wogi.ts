export interface IWogi {
  getProducts(userName: string, password: string): Promise<WogiProducts | undefined>;
  getProductLines(userName: string, password: string): Promise<WogiProductLines | undefined>;
}

export type WogiProducts = {
  products: {
    [key: string]: string | number | boolean | object | null;
  }[];
};

export type WogiProductLines = {
  productLines: {
    [key: string]: string | number | boolean | object | null;
  }[];
};
