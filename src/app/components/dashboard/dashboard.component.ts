import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { CryptoCardComponent } from '../crypto-card/crypto-card.component';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';

interface Crypto {
  symbol: string;
  price: number;
  gains: number;
  ableToBuy: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CryptoCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Input() transactions: boolean = false;
  stocks: Crypto[] = [];
  capital: number = 0;
  private cryptoSubscription: Subscription | undefined;
  private previousPrices: { [symbol: string]: number } = {};

  constructor(
    private cryptoService: CryptoService,
    private userService: UserService,
  ) {}

  setUserCapital(): void {
    this.userService.getUserCapital().then((capital) => {
      if (capital === undefined) {
        console.error('Could not retrieve user capital.');
        return;
      }
      this.capital = capital;
    });
  }

  subscribeToCryptoPrices(): void {
    const symbols = ['BTC', 'ETH', 'XRP', 'BCH', 'ADA', 'LTC', 'XEM', 'XLM'];
    this.stocks = symbols.map((symbol) => ({
      symbol,
      price: 0,
      gains: 0,
      ableToBuy: this.transactions,
    }));

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
        },
      );
  }

  ngOnInit(): void {
    this.setUserCapital();
    this.subscribeToCryptoPrices();
  }

  ngOnDestroy(): void {
    if (this.cryptoSubscription) {
      this.cryptoSubscription.unsubscribe();
    }
  }
}
