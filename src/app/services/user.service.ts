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
    if (user) {
      console.log(user.uid);
      return user.uid;
    }
    return undefined;
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
        return snapshot.val(); // Return the capital value
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
    if (!uid) {
      console.log('User not logged in');
      return;
    }
    const capitalRef = ref(this.db, `users/${uid}/capital`);
    try {
      await set(capitalRef, newCapital);
      console.log('Capital updated successfully');
    } catch (error) {
      console.error('Error updating capital:', error);
    }
  }

  async logUserTrade(symbol: string, price: number): Promise<void> {
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
        timestamp: Date.now(),
      });
      console.log('Trade logged successfully');
    } catch (error) {
      console.error('Error logging trade:', error);
    }
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
        console.log('Trades:', snapshot.val());
        return snapshot.val();
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
