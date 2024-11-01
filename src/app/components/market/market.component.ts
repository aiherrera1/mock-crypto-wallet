import { Component } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css',
})
export class MarketComponent {
  constructor() {}
}
