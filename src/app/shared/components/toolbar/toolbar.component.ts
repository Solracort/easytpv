import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  businessName = 'EasyTPV';

  constructor() { }

  ngOnInit(): void {
    this.loadBusinessName();
  }

  private loadBusinessName(): void {
    const saved = localStorage.getItem('BUSINESS_NAME');
    if (saved) {
      this.businessName = saved;
    }
  }
}
