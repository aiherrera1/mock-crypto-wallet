import { Component, Input } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crypto-card.component.html',
  styleUrls: ['./crypto-card.component.css'],
})
export class CryptoCardComponent {
  @Input() symbol: string = '';
  @Input() price: number = 0;
  @Input() gains: number = 0;
  @Input() ableToBuy: boolean = false;
  quantity: number = 0;

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService,
  ) {}

  async hasSufficientFunds(): Promise<boolean> {
    try {
      const capital = await this.userService.getUserCapital();
      if (capital === undefined) {
        console.error('Could not retrieve user capital.');
        return false;
      }
      return capital >= this.price * this.quantity;
    } catch (err) {
      console.error('Error checking funds:', err);
      return false;
    }
  }

  async handleBuy(): Promise<void> {
    if (await this.hasSufficientFunds()) {
      try {
        await this.userService.logUserTrade(
          this.symbol,
          this.price,
          this.quantity,
        );
      } catch (err) {
        console.error('Purchase failed:', err);
        // Handle error (e.g., show error message to user)
      }
    } else {
      alert('Insufficient funds');
    }
  }
}
