import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  businessName: string = '';
  businessLocation: string = '';
  apiUrl: string = 'http://localhost:3000/api';

  // constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.businessName = localStorage.getItem('BUSINESS_NAME') || '';
    this.businessLocation = localStorage.getItem('BUSINESS_LOCATION') || '';
    const savedApiUrl = localStorage.getItem('API_URL');
    if (savedApiUrl) {
      this.apiUrl = savedApiUrl;
    }
  }

  saveSettings(): void {
    localStorage.setItem('BUSINESS_NAME', this.businessName);
    localStorage.setItem('BUSINESS_LOCATION', this.businessLocation);
    localStorage.setItem('API_URL', this.apiUrl);
    // this.apiService.setApiUrl(this.apiUrl);
    alert('Configuración guardada correctamente');
  }

  exportData(): void {
    const allData = {
      products: localStorage.getItem('products'),
      orders: localStorage.getItem('orders'),
      expenses: localStorage.getItem('expenses'),
    };
    console.log('Datos para exportar:', allData);
    alert('Datos exportados a consola');
  }

  clearData(): void {
    if (confirm('¿Estás seguro? Esta acción eliminará todos los datos locales.')) {
      localStorage.clear();
      alert('Datos eliminados');
      window.location.reload();
    }
  }
}
