import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
  authState,
  fetchSignInMethodsForEmail,
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

  async signUp(email: string, password: string): Promise<UserCredential> {
    const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
    if (signInMethods.length > 0) {
      throw new Error('An account already exists with this email.');
    }

    const user = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    this.setStartingUserCapital(user.user.uid);
    return user;
  }

  private setStartingUserCapital(userId: string) {
    set(ref(this.db, `users/${userId}`), {
      capital: this.generateRandomCapital(),
    });
  }

  private generateRandomCapital() {
    const minCapital = 100;
    const maxCapital = 100_000;
    return Math.floor(Math.random() * (maxCapital - minCapital) + minCapital);
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getUserCapital(userId: string) {
    return ref(this.db, `users/${userId}/capital`);
  }
}
