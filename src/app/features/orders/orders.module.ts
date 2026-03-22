import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrderCartComponent } from './order-cart/order-cart.component';
import { OrderCompleteModalComponent } from './order-complete-modal/order-complete-modal.component';
import { OrderListComponent } from './order-list/order-list.component';
import { TableSelectorComponent } from './table-selector/table-selector.component';
import { OrderProductListComponent } from './order-product-list/order-product-list.component';
import { OrderProductCustomizeModalComponent } from './order-product-customize-modal/order-product-customize-modal.component';
import { OrderProductSelectorModalComponent } from './order-product-selector-modal/order-product-selector-modal.component';
import { OrderPaymentModalComponent } from './order-payment-modal/order-payment-modal.component';
import { OrdersComponent } from './orders.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderCartComponent,
    OrderCompleteModalComponent,
    OrderListComponent,
    TableSelectorComponent,
    OrderProductListComponent,
    OrderProductCustomizeModalComponent,
    OrderProductSelectorModalComponent,
    OrderPaymentModalComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatRadioModule,
    MatSlideToggleModule
  ]
})
export class OrdersModule { }
