import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush, // Add OnPush strategy
})
export class CryptoCardComponent implements OnInit {
  @Input() symbol: string = '';
  @Input() price: number = 0;
  @Input() gains: number = 0;
  @Input() ableToBuy: boolean = false;
  @Input() ableToSell: boolean = false;
  @Input() shares: number = 0;
  buyQuantity: number = 0;
  sellQuantity: number = 0;

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
      return capital >= this.price * this.buyQuantity;
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
          this.buyQuantity,
          'buy',
        );
      } catch (err) {
        console.error('Purchase failed:', err);
        // Handle error (e.g., show error message to user)
      }
    } else {
      alert('Insufficient funds');
    }
  }

  async handleSell(): Promise<void> {
    if (this.shares >= this.sellQuantity) {
      try {
        await this.userService.logUserTrade(
          this.symbol,
          this.price,
          this.sellQuantity,
          'sell',
        );
      } catch (err) {
        console.error('Sale failed:', err);
        // Handle error (e.g., show error message to user)
      }
    }
  }

  async ngOnInit(): Promise<void> {}
}
