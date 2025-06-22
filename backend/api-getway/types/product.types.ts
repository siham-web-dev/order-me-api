export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  ingredients: string[];
  sizes?: Size[];
}
interface Size {
  id: string;
  name: string;
  priceModifier: number;
}
