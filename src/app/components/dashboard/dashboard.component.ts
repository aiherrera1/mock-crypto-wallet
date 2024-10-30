// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { CryptoCardComponent } from '../crypto-card/crypto-card.component';
import { Subscription } from 'rxjs';

interface Crypto {
  symbol: string;
  price: number;
  gains: number; // Percentage gain/loss
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CryptoCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stocks: Crypto[] = [];
  private cryptoSubscription: Subscription | undefined;
  private previousPrices: { [symbol: string]: number } = {};

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    // Initialize with empty stocks or predefined symbols
    const symbols = ['BTC', 'ETH', 'XRP', 'BCH', 'ADA', 'LTC', 'XEM', 'XLM'];
    this.stocks = symbols.map((symbol) => ({
      symbol,
      price: 0,
      gains: 0,
    }));

    // Subscribe to the crypto prices observable
    this.cryptoSubscription = this.cryptoService
      .getCryptoPricesEvery30Seconds()
      .subscribe(
        (cryptoPrices) => {
          cryptoPrices.forEach((crypto) => {
            const stock = this.stocks.find((s) => s.symbol === crypto.symbol);
            if (stock) {
              const previousPrice =
                this.previousPrices[crypto.symbol] || crypto.price;
              const gain =
                previousPrice !== 0
                  ? ((crypto.price - previousPrice) / previousPrice) * 100
                  : 0;
              stock.price = crypto.price;
              stock.gains = gain;
              this.previousPrices[crypto.symbol] = crypto.price;
            }
          });
        },
        (error) => {
          console.error('Error fetching crypto prices:', error);
          // Optionally, display an error message to the user
        },
      );
  }

  ngOnDestroy(): void {
    if (this.cryptoSubscription) {
      this.cryptoSubscription.unsubscribe();
    }
  }
}
