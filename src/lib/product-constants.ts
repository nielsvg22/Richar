export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  published: boolean;
  sortOrder: number;
};

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
};
