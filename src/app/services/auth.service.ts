import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  // Sign Up
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
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

  // Observe Auth State
  authState() {
    return this.authState;
  }
}
