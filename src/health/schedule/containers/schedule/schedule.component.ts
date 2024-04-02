import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ScheduleItem,
  ScheduleService,
} from '../../../shared/services/schedule/schedule.service';
import {
  Meal,
  MealsService,
} from '../../../shared/services/meals/meals.service';
import {
  Workout,
  WorkoutsService,
} from '../../../shared/services/workouts/workouts.service';
import { Observable, Subscription, tap } from 'rxjs';
import { Store } from '../../../../../store';

@Component({
  selector: 'schedule',
  styleUrls: ['schedule.component.scss'],
  template: `
    <div class="schedule">
      <schedule-calendar
        [date]="date$ | async"
        [items]="(schedule$ | async)!"
        (change)="changeDate($event)"
        (select)="changeSection($event)"
      >
      </schedule-calendar>

      <schedule-assign
        *ngIf="open"
        [section]="selected$ | async"
        [list]="list$ | async"
        (update)="assignItem($event)"
        (cancel)="closeAssign()"
      >
      </schedule-assign>
    </div>
  `,
})
export class ScheduleComponent implements OnInit, OnDestroy {
  open = false;
  date$!: Observable<any>;
  selected$!: Observable<any>;
  list$!: Observable<Meal[] | Workout[]>;
  schedule$!: Observable<ScheduleItem[]>;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private mealsService: MealsService,
    private workoutsService: WorkoutsService,
    private scheduleService: ScheduleService,
  ) {}

  changeDate(date: Date): void {
    this.scheduleService.updateDate(date);
  }

  changeSection(event: any) {
    this.open = true;
    this.scheduleService.selectSection(event);
  }

  ngOnInit() {
    this.date$ = this.store.select('date');
    this.schedule$ = this.store
      .select('schedule')
      .pipe(tap((x: any) => console.log('schedule$', x)));

    this.selected$ = this.store.select('selected');
    this.list$ = this.store
      .select('list')
      .pipe(tap((x: any) => console.log('list$', x)));

    this.subscriptions = [
      this.scheduleService.schedule$.subscribe(),
      this.scheduleService.selected$.subscribe(),
      this.scheduleService.list$.subscribe(),
      this.scheduleService.items$.subscribe(),
      this.mealsService.meals$.subscribe(),
      this.workoutsService.workouts$.subscribe(),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  assignItem(items: string[]) {
    console.log('assign updated', items);
    this.scheduleService.updateItems(items);
    this.closeAssign();
  }

  closeAssign() {
    this.open = false;
  }
}
