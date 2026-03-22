import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>([]);
  private readonly STORAGE_KEY = 'products_v2'; // Cambiado para regenerar mocks

  constructor(private storage: StorageService) {
    this.initializeProducts();
  }

  /**
   * Inicializar productos desde localStorage o cargar mock data
   */
  private initializeProducts(): void {
    const saved = this.storage.getItem<Product[]>(this.STORAGE_KEY);
    if (saved && saved.length > 0) {
      this.products$.next(saved);
    } else {
      // Cargar mock data la primera vez
      const mockProducts = this.generateMockProducts();
      this.storage.setItem(this.STORAGE_KEY, mockProducts);
      this.products$.next(mockProducts);
    }
  }

  /**
   * Obtener todos los productos como Observable
   */
  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  /**
   * Obtener productos por categoría
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return new Observable(observer => {
      this.products$.subscribe(products => {
        observer.next(products.filter(p => p.category === category));
      });
    });
  }

  /**
   * Obtener producto por ID
   */
  getProductById(id: string): Product | undefined {
    return this.products$.value.find(p => p.id === id);
  }

  /**
   * Obtener categorías únicas
   */
  getCategories(): string[] {
    const categories = new Set(this.products$.value.map(p => p.category));
    return Array.from(categories).sort();
  }

  /**
   * Agregar nuevo producto
   */
  addProduct(product: Product | Omit<Product, 'id' | 'createdAt'>): Product {
    let newProduct: Product;
    
    // Si el producto ya tiene id, es que viene del modal (editando nuevo)
    if ('id' in product && product.id) {
      newProduct = {
        ...product as Product,
        createdAt: product.createdAt || new Date(),
      };
    } else {
      // Caso: crear nuevo desde formulario
      newProduct = {
        ...product as Omit<Product, 'id' | 'createdAt'>,
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };
    }
    
    const updated = [...this.products$.value, newProduct];
    this.products$.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
    return newProduct;
  }

  /**
   * Actualizar producto
   */
  updateProduct(id: string, changes: Partial<Product>): void {
    const updated = this.products$.value.map(p =>
      p.id === id ? { ...p, ...changes, id: p.id, createdAt: p.createdAt } : p
    );
    this.products$.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
  }

  /**
   * Eliminar producto
   */
  deleteProduct(id: string): void {
    const updated = this.products$.value.filter(p => p.id !== id);
    this.products$.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
  }

  /**
   * Generar ~100 productos mock aleatorios
   */
  private generateMockProducts(): Product[] {
    const categories = ['Entrantes', 'Hamburguesas', 'Camperos', 'Bocadillos', 'Sándwiches', 'Bebidas', 'Postres'];
    const products: Product[] = [];

    const templates = {
      'Entrantes': [
        { name: 'Croquetas', desc: 'Croquetas caseras de jamón', price: 5.99, ingredients: ['Jamón cocido'] },
        { name: 'Ensalada Latino', desc: 'Lechuga, tomate, aguacate, maíz y vinagreta', price: 7.99, ingredients: ['Lechuga', 'Tomate'] },
        { name: 'Ensalada Alemana', desc: 'Papas, huevo duro, carne y mayonesa', price: 8.49, ingredients: ['Huevo duro', 'Mayonesa'] },
        { name: 'Ensalada Marinera', desc: 'Gambas, camarones, pulpo y vinagreta', price: 9.99, ingredients: [] },
      ],
      'Hamburguesas': [
        { name: 'Normal', desc: 'Carne, queso, lechuga, tomate', price: 8.99, ingredients: ['Queso', 'Lechuga', 'Tomate'] },
        { name: 'Burguer Latin', desc: 'Carne, queso, huevo, cebolla caramelizada', price: 9.99, ingredients: ['Queso', 'Huevo frito', 'Cebolla'] },
        { name: 'Cresta', desc: 'Carne, queso, bacon, huevo, champiñones', price: 10.49, ingredients: ['Queso', 'Bacon', 'Huevo frito'] },
        { name: 'Cheeseburguer', desc: 'Doble queso, carne, cebolla, pepinillo', price: 11.99, ingredients: ['Queso', 'Cebolla'] },
        { name: 'LatinDuo', desc: 'Doble carne, doble queso, aguacate, huevo', price: 12.99, ingredients: ['Queso', 'Huevo frito'] },
        { name: 'Montadito de Lomo', desc: 'Lomo de cerdo, queso, tomate, cebolla', price: 10.99, ingredients: ['Queso', 'Tomate', 'Cebolla'] },
      ],
      'Camperos': [
        { name: 'Normal', desc: 'Pan casero con jamón y tomate', price: 6.99, ingredients: ['Jamón serrano', 'Tomate'] },
        { name: 'Atún', desc: 'Pan casero con atún, mayonesa y lechuga', price: 7.49, ingredients: ['Atún', 'Mayonesa', 'Lechuga'] },
        { name: 'Bacon', desc: 'Pan casero con bacon crujiente y queso', price: 7.99, ingredients: ['Bacon', 'Queso'] },
        { name: 'Pollo', desc: 'Pan casero con pechuga de pollo a la plancha', price: 7.49, ingredients: ['Pollo'] },
        { name: 'Tortilla de patatas', desc: 'Pan casero con tortilla española', price: 6.99, ingredients: ['Tortilla de patatas'] },
        { name: 'Mogollon', desc: 'Pan casero con jamón, queso, huevo y cebolla', price: 8.99, ingredients: ['Jamón serrano', 'Queso', 'Huevo frito', 'Cebolla'] },
        { name: 'Latino', desc: 'Pan casero con pollo, aguacate, piña y mayonesa', price: 8.49, ingredients: ['Pollo', 'Mayonesa'] },
        { name: 'Anchoas', desc: 'Pan casero con anchoas, queso y aceitunas', price: 7.99, ingredients: ['Anchoas', 'Queso'] },
        { name: 'Roquefort', desc: 'Pan casero con queso roquefort y carne', price: 8.49, ingredients: ['Roquefort'] },
      ],
      'Bocadillos': [
        { name: 'Jamón', desc: 'Jamón serrano en barra crujiente', price: 5.99, ingredients: ['Jamón serrano'] },
        { name: 'Serranito', desc: 'Jamón, tomate y cebolla frita en barra', price: 6.49, ingredients: ['Jamón serrano', 'Tomate', 'Cebolla'] },
        { name: 'Pepito Pollo', desc: 'Pechuga de pollo, huevo y mayonesa', price: 6.99, ingredients: ['Pollo', 'Huevo frito', 'Mayonesa'] },
        { name: 'Pepito Cerdo', desc: 'Lomo de cerdo, huevo y mayonesa', price: 7.49, ingredients: ['Huevo frito', 'Mayonesa'] },
        { name: 'Vegatal', desc: 'Verduras asadas, queso y huevo', price: 5.99, ingredients: ['Queso', 'Huevo frito', 'Lechuga', 'Tomate'] },
      ],
      'Sándwiches': [
        { name: 'Mixto', desc: 'Jamón y queso tostado', price: 6.99, ingredients: ['Jamón cocido', 'Queso'] },
        { name: 'Pollo', desc: 'Pollo a la plancha, tomate y mayonesa', price: 7.49, ingredients: ['Pollo', 'Tomate', 'Mayonesa'] },
        { name: 'Bacon', desc: 'Bacon crujiente, huevo y queso', price: 7.99, ingredients: ['Bacon', 'Huevo frito', 'Queso'] },
        { name: 'Tomy', desc: 'Jamón, queso, huevo y cebolla', price: 8.49, ingredients: ['Jamón cocido', 'Queso', 'Huevo frito', 'Cebolla'] },
      ],
      'Bebidas': [
        { name: 'Cola', desc: 'Refresco de cola 330ml', price: 2.49, ingredients: [] },
        { name: 'Naranja Limon', desc: 'Naranja y limón 330ml', price: 2.49, ingredients: [] },
        { name: 'Aquarius', desc: 'Bebida isotónica 330ml', price: 2.99, ingredients: [] },
        { name: 'cerveza Alhambra', desc: 'Cerveza Alhambra 330ml', price: 3.50, ingredients: [] },
        { name: 'Cerveza Cruzcampo', desc: 'Cerveza Cruzcampo 330ml', price: 3.50, ingredients: [] },
        { name: 'Agua', desc: 'Agua mineral 500ml', price: 1.50, ingredients: [] },
        { name: 'Zumo', desc: 'Zumo natural 250ml', price: 2.99, ingredients: [] },
        { name: 'RedBull', desc: 'RedBull energético 250ml', price: 3.99, ingredients: [] },
        { name: 'Biofrutas', desc: 'Bebida de frutas Biofrutas 200ml', price: 2.49, ingredients: [] },
      ],
      'Postres': [
        { name: 'Helado', desc: 'Bola de helado sabor a elegir', price: 2.99, ingredients: [] },
        { name: 'Cheesecake', desc: 'Rebanada de cheesecake de queso', price: 4.99, ingredients: [] },
        { name: 'Flan', desc: 'Flan de vainilla casero', price: 2.50, ingredients: [] },
        { name: 'Tiramisú', desc: 'Tiramisú italiano clásico', price: 4.49, ingredients: [] },
      ],
    };

    let id = 1;
    Object.entries(templates).forEach(([category, items]) => {
      items.forEach((item: any) => {
        products.push({
          id: `prod_${id}`,
          name: item.name,
          description: item.desc,
          price: item.price,
          category,
          defaultIngredients: item.ingredients || [],
          imageUrl: `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`,
          available: true, // Todos disponibles para agregar a pedidos
          createdAt: new Date(),
        });
        id++;
      });
    });

    return products; // Retornar todos los productos
  }
}
