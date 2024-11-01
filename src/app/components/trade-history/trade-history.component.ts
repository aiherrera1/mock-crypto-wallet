import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

interface Transaction {
  symbol: string;
  price: number;
  quantity: number;
  date: string;
  action: 'buy' | 'sell';
}

@Component({
  selector: 'app-trade-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.css'],
})
export class TradeHistoryComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];

  constructor(private userService: UserService) {}

  totalAmount(price: number, quantity: number): number {
    return price * quantity;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.transactions = await this.userService.getUserTrades();
      console.log('User transactions:', this.transactions);
    } catch (error) {
      console.error('Error fetching user trades:', error);
      this.transactions = [];
    }
  }

  ngOnDestroy(): void {
    this.transactions = []; // Clear transactions on destroy
  }
}
