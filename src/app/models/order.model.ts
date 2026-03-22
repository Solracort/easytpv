export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
  selectedIngredients?: {
    included: string[]; // Ingredientes por defecto que se mantienen
    additional: string[]; // Ingredientes adicionales agregados
  };
}

export interface Order {
  id: string;
  items: OrderItem[];
  tableNumber?: string; // Número de mesa (1, 2, 3...) o nombre (para llevar)
  isForTakeaway: boolean; // true si es para llevar
  customerName?: string; // Nombre del cliente (si es para llevar)
  customNotes?: string;
  date: Date;
  total: number;
  paymentMethod?: 'cash' | 'card'; // undefined mientras no se cierre
  status: 'active' | 'closed' | 'paid'; // active, closed (listo para pagar), paid (cerrado)
  tip?: number;
  createdAt: Date;
  updatedAt: Date;
}
