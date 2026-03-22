import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductEditModalComponent } from '../product-edit-modal/product-edit-modal.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'available', 'actions'];
  isLoading = false;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openCreateProductDialog(): void {
    const dialogRef = this.dialog.open(ProductEditModalComponent, {
      width: '500px',
      data: null  // null significa crear nuevo
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
        this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 2000 });
      }
    });
  }

  openEditProductDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductEditModalComponent, {
      width: '500px',
      data: { ...product }  // Copiar para evitar mutaciones
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
        this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', { duration: 2000 });
      }
    });
  }

  confirmDeleteProduct(product: Product): void {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`);
    if (confirmed) {
      this.productService.deleteProduct(product.id);
      this.loadProducts();
      this.snackBar.open('Producto eliminado exitosamente', 'Cerrar', { duration: 2000 });
    }
  }

  toggleAvailability(product: Product): void {
    const updated = { ...product, available: !product.available };
    this.productService.updateProduct(product.id, updated);
    this.loadProducts();
    this.snackBar.open(`Producto ${updated.available ? 'disponible' : 'no disponible'}`, 'Cerrar', { duration: 2000 });
  }
}
