import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { OrderProductCustomizeModalComponent } from '../order-product-customize-modal/order-product-customize-modal.component';

@Component({
  selector: 'app-order-product-selector-modal',
  templateUrl: './order-product-selector-modal.component.html',
  styleUrls: ['./order-product-selector-modal.component.scss']
})
export class OrderProductSelectorModalComponent implements OnInit {
  products: Product[] = [];
  selectedCategory: string = '';
  categories: string[] = [];
  searchTerm = '';

  constructor(
    public dialogRef: MatDialogRef<OrderProductSelectorModalComponent>,
    private productService: ProductService,
    private orderService: OrderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.categories = [...new Set(products.map(p => p.category))].sort();
      
      if (this.categories.length > 0 && !this.selectedCategory) {
        this.selectedCategory = this.categories[0];
      }
    });
  }

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

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  addProduct(product: Product): void {
    const dialogRef = this.dialog.open(OrderProductCustomizeModalComponent, {
      data: { product },
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(() => {
      // Cerrar el selector automáticamente después de agregar un producto
      this.dialogRef.close();
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
