import { Injectable } from '@angular/core';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { Meal } from '../meals/meals.service';
import { Workout } from '../workouts/workouts.service';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '../../../../../store';
import { AngularFireDatabase } from '@angular/fire/compat/database';

export interface ScheduleItem {
  meals?: Meal[];
  workouts?: Workout[];
  section: string;
  timestamp: number;
  $key?: string;
}

export interface ScheduleList {
  morning?: ScheduleItem;
  lunch?: ScheduleItem;
  evening?: ScheduleItem;
  snacks?: ScheduleItem;
  [key: string]: any;
}

@Injectable()
export class ScheduleService {
  myBehaviorSubject = new BehaviorSubject(null);

  private date$ = new BehaviorSubject(new Date());
  private section$ = new Subject();
  private itemList$ = new Subject();

  items$ = this.itemList$.pipe(
    withLatestFrom(this.section$),
    map(([items, section]: any[]) => {
      const id = section.data.$key;
      const defaults: ScheduleItem = {
        workouts: [],
        meals: [],
        section: section.section,
        timestamp: new Date(section.day).getTime(),
      };

      const payload = {
        ...(id ? section.data : defaults),
        ...items,
      };

      if (id) {
        return this.updateSection(id, payload);
      } else {
        return this.createSection(payload);
      }
    }),
  );

  selected$ = this.section$.pipe(
    map((next: any) => {
      return this.store.set('selected', next);
    }),
  );

  list$ = this.section$.pipe(
    map((value: any) => {
      this.store.set('list', this.store.value[value.type]);
      return this.store.value[value.type];
    }),
  );

  schedule$: Observable<any> = this.date$.pipe(
    map((day: any) => {
      this.store.set('date', day);
      const startAt = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      ).getTime();

      const endAt =
        new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate() + 1,
        ).getTime() - 1;

      return { startAt, endAt };
    }),
    switchMap(({ startAt, endAt }: any) => this.getSchedule(startAt, endAt)),
    map((data: any) => {
      const mapped: ScheduleList = {};
      for (const prop of data) {
        if (!mapped[prop.section]) {
          mapped[prop.section] = prop;
        } else {
          mapped[prop.section] = Object.assign(mapped[prop.section], prop);
        }
      }
      this.store.set('schedule', mapped);
      return mapped;
    }),
  );

  constructor(
    private store: Store,
    private authService: AuthService,
    private db: AngularFireDatabase,
  ) {
    this.uid();
  }

  async uid() {
    return this.authService.user.then((x: any) => {
      this.myBehaviorSubject.next(x?.uid);
      return x?.uid;
    });
  }

  updateItems(items: string[]) {
    this.itemList$.next(items);
  }

  updateDate(date: Date) {
    this.date$.next(date);
  }

  selectSection(event: any) {
    this.section$.next(event);
  }

  private createSection(payload: ScheduleItem) {
    return this.db
      .list(`schedule/` + this.myBehaviorSubject.getValue())
      .push(payload);
  }

  private updateSection(key: string, payload: ScheduleItem) {
    return this.db
      .object(`schedule/${this.myBehaviorSubject.getValue()}/${key}`)
      .update(payload);
  }

  private getSchedule(startAt: number, endAt: number) {
    return this.db
      .list(`schedule/${this.myBehaviorSubject.getValue()}`, (ref) =>
        ref.orderByChild('timestamp').startAt(startAt).endAt(endAt),
      )
      .valueChanges();
  }
}
