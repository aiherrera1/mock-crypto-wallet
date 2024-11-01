// dashboard.component.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { CryptoCardComponent } from '../crypto-card/crypto-card.component';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

interface Crypto {
  symbol: string;
  price: number;
  ableToBuy: boolean;
  ableToSell: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CryptoCardComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() transactions: boolean = false;
  stocks: Crypto[] = [];
  capital: number = 0;
  formattedCapital: string = '';
  private cryptoSubscription: Subscription | null = null;
  private previousPrices: { [symbol: string]: number } = {};

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService,
  ) {}

  async setUserCapital(): Promise<void> {
    try {
      const capital = await this.userService.getUserCapital();
      if (capital === undefined) {
        console.error('Could not retrieve user capital.');
        return;
      }
      this.capital = capital;
    } catch (error) {
      console.error('Error retrieving user capital:', error);
    }
  }

  async subscribeToCryptoPrices(): Promise<void> {
    const symbols = ['BTC', 'ETH', 'XRP', 'BCH', 'ADA', 'LTC', 'XEM', 'XLM'];
    this.stocks = symbols.map((symbol) => ({
      symbol,
      price: 0,
      ableToBuy: this.transactions,
      ableToSell: this.transactions,
    }));

    this.cryptoSubscription = this.cryptoService
      .getCryptoPricesEvery30Seconds()
      .subscribe(
        (cryptoPrices) => this.updateCryptoPrices(cryptoPrices),
        (error) => this.handleCryptoError(error),
      );
  }

  private updateCryptoPrices(
    cryptoPrices: { symbol: string; price: number }[],
  ): void {
    cryptoPrices.forEach((crypto) => {
      const stock = this.stocks.find((s) => s.symbol === crypto.symbol);
      if (stock) {
        const previousPrice =
          this.previousPrices[crypto.symbol] ?? crypto.price;
        stock.price = crypto.price;
        this.previousPrices[crypto.symbol] = crypto.price;
      }
    });
  }

  private handleCryptoError(error: any): void {
    console.error('Error fetching crypto prices:', error);
  }

  ngOnInit(): void {
    this.setUserCapital();
    this.subscribeToCryptoPrices();
    console.log(this.stocks);
  }

  ngOnDestroy(): void {
    this.cryptoSubscription?.unsubscribe();
  }
}
