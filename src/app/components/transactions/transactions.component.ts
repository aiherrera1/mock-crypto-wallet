import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserService } from '../../services/user.service';

interface Transaction {
  symbol: string;
  price: number;
  quantity: number;
  date: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];

  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.transactions = await this.userService.getUserTrades();
    } catch (error) {
      console.error('Error fetching user trades:', error);
      this.transactions = [];
    }
  }

  ngOnDestroy(): void {
    this.transactions = []; // Clear transactions on destroy
  }
}
