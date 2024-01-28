export interface IProduct {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  // type: Type;
  gender: "men" | "women" | "kid" | "unisex";
}

export interface ICartProduct {
  id: string;
  image: string;
  price: number;
  size: Size;
  slug: string;
  title: string;
  quantity: number;
}

export type ICategory = "men" | "women" | "kid" | "unisex";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type Type = "shirts" | "pants" | "hoodies" | "hats";
