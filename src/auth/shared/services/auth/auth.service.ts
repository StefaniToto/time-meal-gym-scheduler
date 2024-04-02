import { Injectable } from '@angular/core';
import { Store } from '../../../../../store';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

export interface User {
  email: string | null;
  uid: string;
  authenticated: boolean;
}

@Injectable()
export class AuthService {
  auth$ = this.af.authState.pipe(
    map((next) => {
      if (!next) {
        this.store.set('user', null);
        return;
      }
      const user: User = {
        email: next.email,
        uid: next.uid,
        authenticated: true,
      };
      this.store.set('user', user);
    }),
  );

  constructor(
    private store: Store,
    private af: AngularFireAuth,
  ) {}

  get user() {
    return this.af.currentUser;
  }

  get authState() {
    return this.af.authState;
  }

  createUser(email: string, password: string) {
    return this.af.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): Promise<void> {
    return this.af.signOut();
  }
}
