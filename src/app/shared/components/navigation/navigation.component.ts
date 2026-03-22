import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  navLinks = [
    { label: 'Productos', icon: 'shopping_cart', route: '/products' },
    { label: 'Pedidos', icon: 'receipt', route: '/orders' },
    { label: 'Gastos', icon: 'money_off', route: '/expenses' },
    { label: 'Reportes', icon: 'bar_chart', route: '/reports' },
  ];
}
