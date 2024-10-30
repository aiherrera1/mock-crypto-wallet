import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
  authState,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

import { getDatabase, ref, set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private db = getDatabase();
  public authState$: Observable<User | null>;
  constructor(private auth: Auth) {
    this.authState$ = authState(this.auth);
  }
  // Sign Up
  async signUp(email: string, password: string): Promise<UserCredential> {
    const user = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    this.setStartingUserCapital(user.user.uid);
    return user;
  }

  setStartingUserCapital(userId: string) {
    set(ref(this.db, `users/${userId}`), {
      capital: this.generateRandomCapital(),
    });
  }

  generateRandomCapital() {
    const minCapital = 100;
    const maxCapital = 100_000;
    return Math.floor(Math.random() * (maxCapital - minCapital) + minCapital);
  }
  // Sign In
  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Sign Out
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Get User Capital
  getUserCapital(userId: string) {
    return ref(this.db, `users/${userId}/capital`);
  }
}
