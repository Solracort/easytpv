import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) },
      { path: 'orders', loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule) },
      { path: 'expenses', loadChildren: () => import('./features/expenses/expenses.module').then(m => m.ExpensesModule) },
      { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
