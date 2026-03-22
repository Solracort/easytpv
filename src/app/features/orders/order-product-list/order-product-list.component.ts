import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product, Order } from '../../../models';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { OrderProductCustomizeModalComponent } from '../order-product-customize-modal/order-product-customize-modal.component';

@Component({
  selector: 'app-order-product-list',
  templateUrl: './order-product-list.component.html',
  styleUrls: ['./order-product-list.component.scss']
})
export class OrderProductListComponent implements OnInit {
  products: Product[] = [];
  currentOrder: Order | null = null;
  selectedCategory: string = '';
  categories: string[] = [];
  
  // Búsqueda
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.orderService.getCurrentOrder().subscribe(order => {
      this.currentOrder = order;
    });
  }

  /**
   * Cargar productos y extraer categorías
   */
  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      
      // Extraer todas las categorías únicas
      this.categories = [...new Set(products.map(p => p.category))].sort();
      
      if (this.categories.length > 0 && !this.selectedCategory) {
        this.selectedCategory = this.categories[0];
      }
    });
  }

  /**
   * Obtener productos filtrados por categoría y búsqueda
   */
  getFilteredProducts(): Product[] {
    let filtered = this.products;

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    return filtered;
  }

  /**
   * Abrir modal de customización de producto
   */
  addProductToOrder(product: Product): void {
    if (!this.currentOrder) {
      alert('Selecciona o crea un pedido primero');
      return;
    }

    const dialogRef = this.dialog.open(OrderProductCustomizeModalComponent, {
      data: { product },
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(() => {
      // El modal agrega el item al pedido automáticamente
    });
  }

  /**
   * Cambiar categoría seleccionada
   */
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
