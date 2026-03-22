import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';
  showAdminPanel: boolean = false;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilters();
      this.categories = this.productService.getCategories();
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange(event: any): void {
    const query = event.target?.value || '';
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.products;

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.description.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredProducts = filtered;
  }

  toggleAdminPanel(): void {
    this.showAdminPanel = !this.showAdminPanel;
    if (this.showAdminPanel) {
      // Recargar productos cuando se abre admin panel
      this.loadProducts();
    }
  }
}
