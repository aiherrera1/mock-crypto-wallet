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
  @Input() shares: number = 0;
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

  async ngOnInit(): Promise<void> {
    if (!this.symbol) {
      console.warn('Symbol is not defined');
      return;
    }

    try {
      this.shares = await this.userService.getSharesOfCrypto(this.symbol);
      this.gains = await this.userService.getProfitOfShares(
        this.symbol,
        this.price,
      );
    } catch (error) {
      console.error('Error fetching shares or profit:', error);
    }
  }
}
