import { Injectable } from '@angular/core';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import { Store } from '../../../../../store';
import { AngularFireDatabase } from '@angular/fire/compat/database';

export interface Meal {
  name: string;
  ingredients: string[];
  timestamp: number;
  $key: string;
  $exists: () => boolean;
}

@Injectable()
export class MealsService {
  myBehaviorSubject = new BehaviorSubject(null);
  meals$!: Observable<any>;

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService,
  ) {
    this.uid.then((r) => {
      this.meals$ = this.db
        .list<Meal>(`meals/` + r)
        .snapshotChanges()
        .pipe(
          map((actions) => {
            let arr = [];
            return actions.map((action) => {
              const data = action.payload.val();
              const $key = action.payload.key;
              arr.push({ $key, ...data });
              this.store.set('meals', arr);
              return { $key, ...data };
            });
          }),
        );
    });
  }

  get uid() {
    return this.authService.user.then((x: any) => {
      this.myBehaviorSubject.next(x?.uid);
      return x?.uid;
    });
  }

  getMeal(key: string): Observable<any> {
    if (!key) return of({});
    return this.store.select<Meal[]>('meals').pipe(
      filter(Boolean),
      map((meals: Meal[]) => meals.find((meal: Meal) => meal.$key === key)),
    );
  }

  addMeal(meal: Meal) {
    return this.db
      .list(`meals/${this.myBehaviorSubject.getValue()}`)
      .push(meal);
  }

  updateMeal(key: string, meal: Meal) {
    return this.db
      .object(`meals/${this.myBehaviorSubject.getValue()}/${key}`)
      .update(meal);
  }

  removeMeal(key: string) {
    return this.db
      .list(`meals/${this.myBehaviorSubject.getValue()}`)
      .remove(key);
  }
}
