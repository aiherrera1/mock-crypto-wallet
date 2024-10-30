import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from '../../services/crypto.service';
import { UserService } from '../../services/user.service';

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
  @Input() ableToBuy: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService,
  ) {}

  async handleBuy(): Promise<void> {
    try {
      const response = await this.cryptoService
        .buyCrypto('hola', this.symbol, this.price)
        .toPromise();
      console.log('Purchase successful:', response);

      this.userService.logUserTrade(this.symbol, this.price);
      const trades: { symbol: string; price: number }[] =
        await this.userService.getUserTrades();
      console.log('Trades:', trades);

      const capital: number | undefined =
        await this.userService.getUserCapital();
      if (capital !== undefined) {
        await this.userService.updateUserCapital(capital - this.price);
        console.log('Capital updated successfully.');
        // Handle success (e.g., show confirmation to user)
      } else {
        console.error('Could not retrieve user capital.');
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      // Handle error (e.g., show error message to user)
    }
  }
}
