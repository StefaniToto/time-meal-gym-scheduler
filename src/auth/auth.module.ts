import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// shared modules
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

export const ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./register/register.module').then((m) => m.RegisterModule),
      },
    ],
  },
];

export const firebaseConfig = {
  // apiKey: 'AIzaSyCXz7GrHLBs-xlsCrr185iG4v4UrNreq2Y',
  // authDomain: 'fitness-app-e668a.firebaseapp.com',
  // databaseURL: 'https://fitness-app-e668a.firebaseio.com',
  // projectId: 'fitness-app-e668a',
  // storageBucket: 'fitness-app-e668a.appspot.com',
  // messagingSenderId: '1014564696462',
  apiKey: 'AIzaSyC3dKiapog-3RYWAEwNq-E3haHZxEGb5_0',
  authDomain: 'capacitor-enappd.firebaseapp.com',
  databaseURL:
    'https://capacitor-enappd-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'capacitor-enappd',
  storageBucket: 'capacitor-enappd.appspot.com',
  messagingSenderId: '183533723836',
  appId: '1:183533723836:web:e3cb6c449f21e4d6ca30b9',
  measurementId: 'G-QESX4GCKD3',
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SharedModule.forRoot(),
  ],
})
export class AuthModule {}
