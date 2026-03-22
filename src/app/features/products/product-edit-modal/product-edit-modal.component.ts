import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ADDITIONAL_INGREDIENTS } from '../../../shared/constants/ingredients';

@Component({
  selector: 'app-product-edit-modal',
  templateUrl: './product-edit-modal.component.html',
  styleUrls: ['./product-edit-modal.component.scss']
})
export class ProductEditModalComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean;
  categories: string[] = [];
  availableIngredients: string[] = ADDITIONAL_INGREDIENTS;
  selectedIngredientsInput: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public inputProduct: Product | null
  ) {
    this.isEditMode = !!inputProduct;
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.categories = this.productService.getCategories();
    if (this.isEditMode && this.inputProduct) {
      this.populateForm(this.inputProduct);
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      available: [true],
    });
  }

  private populateForm(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      available: product.available,
    });
    this.selectedIngredientsInput = [...(product.defaultIngredients || [])];
  }

  toggleIngredient(ingredient: string): void {
    const index = this.selectedIngredientsInput.indexOf(ingredient);
    if (index === -1) {
      this.selectedIngredientsInput.push(ingredient);
    } else {
      this.selectedIngredientsInput.splice(index, 1);
    }
  }

  isIngredientSelected(ingredient: string): boolean {
    return this.selectedIngredientsInput.includes(ingredient);
  }

  removeIngredient(ingredient: string): void {
    this.selectedIngredientsInput = this.selectedIngredientsInput.filter(i => i !== ingredient);
  }

  onSave(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    const formValue = this.productForm.value;
    const product: Product = {
      id: this.isEditMode ? this.inputProduct!.id : `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formValue.name,
      category: formValue.category,
      price: parseFloat(formValue.price),
      description: formValue.description,
      imageUrl: formValue.imageUrl,
      available: formValue.available,
      defaultIngredients: this.selectedIngredientsInput,
      createdAt: this.isEditMode ? this.inputProduct!.createdAt : new Date(),
    };

    if (this.isEditMode) {
      this.productService.updateProduct(product.id, product);
    } else {
      this.productService.addProduct(product);
    }

    this.dialogRef.close(product);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (control.hasError('minLength')) {
      return `${fieldName} debe tener al menos 2 caracteres`;
    }
    if (control.hasError('min')) {
      return `${fieldName} debe ser mayor que 0`;
    }
    if (control.hasError('pattern')) {
      return `${fieldName} debe ser una URL válida (http:// o https://)`;
    }
    return 'El campo no es válido';
  }
}
