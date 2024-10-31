import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { getDatabase, ref, get, set, push } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private db = getDatabase();
  constructor(private authService: AuthService) {}

  getUid(): string | undefined {
    const user = this.authService.getCurrentUser();
    console.log(user);
    if (user) {
      console.log(user.uid);
      return user.uid;
    }
    return undefined;
  }

  formatCapital(capital: number): string {
    return capital.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  async getUserCapital(): Promise<number | undefined> {
    const uid = this.getUid();
    if (!uid) {
      console.log('User not logged in');
      return undefined;
    }

    const capitalRef = ref(this.db, `users/${uid}/capital`);
    try {
      const snapshot = await get(capitalRef);
      if (snapshot.exists()) {
        console.log(`Capital: ${snapshot.val()}`);
        return snapshot.val();
      } else {
        console.log('No capital found for this user');
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching capital:', error);
      return undefined;
    }
  }

  async updateUserCapital(newCapital: number): Promise<void> {
    const uid = this.getUid();
    const capitalRef = ref(this.db, `users/${uid}/capital`);
    try {
      await set(capitalRef, newCapital);
    } catch (error) {
      console.error('Error updating capital:', error);
    }
  }

  updateCapitalOnTrade(symbol: string, price: number, quantity: number): void {
    try {
      this.getUserCapital().then((capital) => {
        if (capital === undefined) {
          console.error('Could not retrieve user capital.');
          return;
        }
        const newCapital = capital - price * quantity;
        this.updateUserCapital(newCapital);
      });
    } catch (error) {
      throw new Error('Error updating capital on trade');
    }
  }

  async logUserTrade(
    symbol: string,
    price: number,
    quantity: number,
  ): Promise<void> {
    const uid = this.getUid();
    if (!uid) {
      console.log('User not logged in');
      return;
    }

    const tradeRef = ref(this.db, `users/${uid}/trades`);
    try {
      await push(tradeRef, {
        symbol,
        price,
        quantity,
        timestamp: Date.now(),
      });
      this.updateCapitalOnTrade(symbol, price, quantity);
      alert('Trade logged successfully');
    } catch (error) {
      console.error('Error logging trade:', error);
      alert('Trade failed');
    }
  }

  formatTrades(
    trades: any,
  ): { symbol: string; price: number; quantity: number; date: string }[] {
    console.log(trades);
    return Object.keys(trades).map((key) => ({
      symbol: trades[key].symbol,
      price: trades[key].price,
      quantity: trades[key].quantity,
      date: new Date(trades[key].timestamp).toLocaleString(),
    }));
  }

  async getUserTrades(): Promise<any> {
    const uid = this.getUid();
    if (!uid) {
      console.log('User not logged in');
      return;
    }
    const tradesRef = ref(this.db, `users/${uid}/trades`);
    try {
      const snapshot = await get(tradesRef);
      if (snapshot.exists()) {
        return this.formatTrades(snapshot.val());
      } else {
        console.log('No trades found for this user');
        return [];
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
      return [];
    }
  }
}
