import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../../store';
import { AuthService, User } from '../auth/shared/services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  styleUrl: './app.component.css',
  template: `
    <div>
      <app-header [user]="(user$ | async)!" (logout)="onLogout()"> </app-header>
      <app-nav *ngIf="(user$ | async)?.authenticated"> </app-nav>
      <div class="wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {
  user$: Observable<User> = this.store.select<User>('user');
  subscription: Subscription;

  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService,
  ) {
    this.subscription = this.authService.auth$.subscribe();
  }

  async onLogout(): Promise<void> {
    await this.authService.logoutUser();
    this.router.navigate(['/auth/login']);
  }
}
