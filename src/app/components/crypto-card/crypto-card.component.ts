import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crypto-card.component.html',
  styleUrls: ['./crypto-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CryptoCardComponent implements OnInit {
  @Input() symbol: string = '';
  @Input() price: number = 0;
  @Input() ableToBuy: boolean = false;

  gains: number = 0;
  shares: number = 0;
  buyQuantity: number = 0;
  sellQuantity: number = 0;
  formattedGains: string = '';
  errorMessage: string = '';
  capital: number = 0;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  hasShares(): boolean {
    return this.shares > 0;
  }

  buyInputIsValid(): boolean {
    return this.buyQuantity > 0;
  }

  sellInputIsValid(): boolean {
    return this.sellQuantity > 0;
  }

  async hasSufficientFunds(): Promise<boolean> {
    try {
      this.capital = (await this.userService.getUserCapital()) ?? 0;
      return this.capital >= this.price * this.buyQuantity;
    } catch (err) {
      console.error('Error checking funds:', err);
      return false;
    }
  }

  async handleBuy(): Promise<void> {
    this.errorMessage = '';

    if (this.buyQuantity <= 0) {
      this.errorMessage = 'Quantity must be greater than 0.';
      this.cdr.markForCheck();
      return;
    }

    if (!(await this.hasSufficientFunds())) {
      this.errorMessage = 'Insufficient funds.';
      this.cdr.markForCheck();
      return;
    }

    try {
      await this.userService.logUserTrade(
        this.symbol,
        this.price,
        this.buyQuantity,
        'buy',
      );
      // Update shares and capital after successful buy
      this.shares = await this.userService.getShares(this.symbol);
      this.capital = (await this.userService.getUserCapital()) ?? 0;
      this.buyQuantity = 0; // Reset the buy quantity
      this.cdr.markForCheck();
    } catch (err) {
      console.error('Purchase failed:', err);
      this.errorMessage = 'Purchase failed. Please try again.';
      this.cdr.markForCheck();
    }
  }

  async handleSell(): Promise<void> {
    this.errorMessage = '';

    if (this.sellQuantity <= 0) {
      this.errorMessage = 'Quantity must be greater than 0.';
      this.cdr.markForCheck();
      return;
    }

    if (this.shares < this.sellQuantity) {
      this.errorMessage = 'You cannot sell more shares than you own.';
      this.cdr.markForCheck();
      return;
    }

    try {
      await this.userService.logUserTrade(
        this.symbol,
        this.price,
        this.sellQuantity,
        'sell',
      );
      this.shares = await this.userService.getShares(this.symbol);
      this.capital = (await this.userService.getUserCapital()) ?? 0;
      this.sellQuantity = 0; // Reset the sell quantity
      this.cdr.markForCheck();
    } catch (err) {
      console.error('Sale failed:', err);
      this.errorMessage = 'Sale failed. Please try again.';
      this.cdr.markForCheck();
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      this.shares = await this.userService.getShares(this.symbol);
      this.gains = await this.userService.getProfitOfShares(
        this.symbol,
        this.price,
      );
      this.capital = (await this.userService.getUserCapital()) ?? 0;

      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.shares = 0;
      this.gains = 0;
      this.capital = 0;
    }
  }
}
