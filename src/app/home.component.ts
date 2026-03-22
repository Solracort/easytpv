import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <h1>Bienvenido a EasyTPV</h1>
      <p>Selecciona una opción del menú para empezar</p>
    </div>
  `,
  styles: [`
    .home-container {
      text-align: center;
      padding: 40px 20px;
      
      h1 {
        color: #D32F2F;
        font-size: 2.5rem;
        margin-bottom: 20px;
      }
      
      p {
        font-size: 1.1rem;
        color: #666;
      }
    }
  `]
})
export class HomeComponent { }
