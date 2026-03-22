export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  defaultIngredients?: string[]; // Ingredientes incluidos por defecto
  createdAt: Date;
}
