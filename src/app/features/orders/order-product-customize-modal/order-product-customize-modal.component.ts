import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product, OrderItem } from '../../../models';
import { OrderService } from '../../../core/services/order.service';
import { ADDITIONAL_INGREDIENTS } from '../../../shared/constants/ingredients';

@Component({
  selector: 'app-order-product-customize-modal',
  templateUrl: './order-product-customize-modal.component.html',
  styleUrls: ['./order-product-customize-modal.component.scss']
})
export class OrderProductCustomizeModalComponent implements OnInit {
  quantity: number = 1;
  notes: string = '';
  
  // Ingredientes
  includedIngredients: string[] = [];
  selectedAdditionalIngredients: string[] = [];
  additionalIngredientsAvailable: string[] = ADDITIONAL_INGREDIENTS;

  constructor(
    public dialogRef: MatDialogRef<OrderProductCustomizeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.product = this.data.product;
    this.includedIngredients = [...(this.product.defaultIngredients || [])];
  }

  get product(): Product {
    return this.data.product;
  }

  set product(value: Product) {
    this.data.product = value;
  }

  /**
   * Remover ingrediente de los incluidos
   */
  removeIncludedIngredient(ingredient: string): void {
    this.includedIngredients = this.includedIngredients.filter(i => i !== ingredient);
  }

  /**
   * Agregar ingrediente adicional
   */
  addAdditionalIngredient(ingredient: string): void {
    if (!this.selectedAdditionalIngredients.includes(ingredient)) {
      this.selectedAdditionalIngredients.push(ingredient);
    }
  }

  /**
   * Remover ingrediente adicional
   */
  removeAdditionalIngredient(ingredient: string): void {
    this.selectedAdditionalIngredients = this.selectedAdditionalIngredients.filter(i => i !== ingredient);
  }

  /**
   * Verificar si un ingrediente ya está agregado
   */
  isIngredientSelected(ingredient: string): boolean {
    return this.selectedAdditionalIngredients.includes(ingredient);
  }

  /**
   * Agregar al carrito (pedido)
   */
  addToCart(): void {
    if (this.quantity <= 0) return;

    const item: OrderItem = {
      productId: this.product.id,
      productName: this.product.name,
      quantity: this.quantity,
      price: this.product.price,
      subtotal: this.quantity * this.product.price,
      notes: this.notes || undefined,
      selectedIngredients: {
        included: this.includedIngredients,
        additional: this.selectedAdditionalIngredients,
      },
    };

    this.orderService.addItemToCurrentOrder(item);
    this.dialogRef.close();
  }

  /**
   * Cerrar modal sin agregar
   */
  close(): void {
    this.dialogRef.close();
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQuantity(): void {
    this.quantity++;
  }
}
