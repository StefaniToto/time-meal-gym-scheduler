import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from '../auth/auth.module';
import { HealthModule } from '../health/health.module';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppNavComponent } from './components/app-nav/app-nav.component';
import { Store } from '../../store';
import { AppComponent } from './app.component';

// routes
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'schedule' },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AuthModule,
    HealthModule,
  ],
  declarations: [AppComponent, AppHeaderComponent, AppNavComponent],
  providers: [Store],
  bootstrap: [AppComponent],
})
export class AppModule {}
