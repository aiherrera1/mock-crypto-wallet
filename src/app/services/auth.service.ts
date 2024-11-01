import { Injectable, NgZone } from '@angular/core';
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
import { Observable, timer, Subscription } from 'rxjs';
import { getDatabase, ref, set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private db = getDatabase();
  public authState$: Observable<User | null>;
  private inactivitySubscription: Subscription | null = null;
  private readonly inactivityTimeout = 10 * 60 * 1000; // 10 minutes

  constructor(
    private auth: Auth,
    private ngZone: NgZone,
  ) {
    this.authState$ = authState(this.auth);

    this.authState$.subscribe((user) => {
      if (user) {
        this.startInactivityTimer();
      } else {
        this.clearInactivityTimer();
      }
    });
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
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        this.startInactivityTimer();
        return userCredential;
      },
    );
  }

  logout(): Promise<void> {
    this.clearInactivityTimer();
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getUserCapital(userId: string) {
    return ref(this.db, `users/${userId}/capital`);
  }

  private startInactivityTimer() {
    this.clearInactivityTimer();

    this.ngZone.runOutsideAngular(() => {
      this.inactivitySubscription = timer(this.inactivityTimeout).subscribe(
        () => {
          this.ngZone.run(() => this.logout());
        },
      );
    });
  }

  private clearInactivityTimer() {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
      this.inactivitySubscription = null;
    }
  }
}
