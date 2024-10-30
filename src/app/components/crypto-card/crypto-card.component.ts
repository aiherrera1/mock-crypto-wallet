import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [],
  templateUrl: './crypto-card.component.html',
  styleUrl: './crypto-card.component.css',
})
export class CryptoCardComponent {
  @Input() symbol: string = '';
  @Input() price: number = 0;
  @Input() gains: number = 0;
}
