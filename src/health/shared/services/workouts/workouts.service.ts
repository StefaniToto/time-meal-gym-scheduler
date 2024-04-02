import { Injectable } from '@angular/core';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import { Store } from '../../../../../store';
import { AngularFireDatabase } from '@angular/fire/compat/database';

export interface Workout {
  name: string;
  type: string;
  strength: any;
  endurance: any;
  timestamp: number;
  $key: string;
  $exists: () => boolean;
}

@Injectable()
export class WorkoutsService {
  myBehaviorSubject = new BehaviorSubject(null);
  workouts$!: Observable<any>;

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService,
  ) {
    this.uid.then((r) => {
      this.workouts$ = this.db
        .list<Workout>(`workouts/` + r)
        .snapshotChanges()
        .pipe(
          map((actions) => {
            let arr = [];
            return actions.map((action) => {
              const data = action.payload.val();
              const $key = action.payload.key;
              arr.push({ $key, ...data });
              this.store.set('workouts', arr);
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

  getWorkout(key: string) {
    if (!key) return of({});
    return this.store.select<Workout[]>('workouts').pipe(
      filter(Boolean),
      map((workouts: Workout[]) =>
        workouts.find((workout: Workout) => workout.$key === key),
      ),
    );
  }

  addWorkout(workout: Workout) {
    return this.db
      .list(`workouts/${this.myBehaviorSubject.getValue()}`)
      .push(workout);
  }

  updateWorkout(key: string, workout: Workout) {
    return this.db
      .object(`workouts/${this.myBehaviorSubject.getValue()}/${key}`)
      .update(workout);
  }

  removeWorkout(key: string) {
    return this.db
      .list(`workouts/${this.myBehaviorSubject.getValue()}`)
      .remove(key);
  }
}
