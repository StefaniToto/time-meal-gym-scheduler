import { BehaviorSubject, Observable, distinctUntilChanged, map } from "rxjs";
import { User } from "./src/auth/shared/services/auth/auth.service";
import { Meal } from "./src/health/shared/services/meals/meals.service";
import { ScheduleItem } from "./src/health/shared/services/schedule/schedule.service";
import { Workout } from "./src/health/shared/services/workouts/workouts.service";


export interface State {
  user?: User,
  meals?: Meal[],
  selected: any,
  list: any,
  schedule?: ScheduleItem[],
  date?: Date,
  workouts?: Workout[],
  [key: string]: any
}

const state: State = {
  user: undefined,
  meals: undefined,
  selected: undefined,
  list: undefined,
  schedule: undefined,
  date: undefined,
  workouts: undefined,
};

export class Store {

  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(map(x => x[name]))
  }

  set(name: string, state: any) {
    this.subject.next({ ...this.value, [name]: state });
  }

}
