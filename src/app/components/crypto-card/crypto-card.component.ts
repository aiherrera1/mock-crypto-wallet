import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  shares: number = 0;
  buyQuantity: number = 0;
  sellQuantity: number = 0;

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
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
        // Update shares after successful buy
        this.shares = await this.userService.getShares(this.symbol);
        this.cdr.markForCheck();
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
        // Update shares after successful sell
        this.shares = await this.userService.getShares(this.symbol);
        this.cdr.markForCheck();
      } catch (err) {
        console.error('Sale failed:', err);
        // Handle error (e.g., show error message to user)
      }
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      console.log('Symbol:', this.symbol);
      this.shares = await this.userService.getShares(this.symbol);
      console.log('Symbol:', this.symbol);
      console.log('Price:', this.price);
      console.log('Gains:', this.gains);
      console.log('Shares:', this.shares);
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error fetching user shares:', error);
      this.shares = 0;
    }
  }
}
