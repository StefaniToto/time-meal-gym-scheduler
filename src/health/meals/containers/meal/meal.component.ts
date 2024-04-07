import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Meal,
  MealsService,
} from '../../../shared/services/meals/meals.service';
import { Observable, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'meal',
  styleUrls: ['meal.component.scss'],
  template: `
    <div class="meal">
      <div class="meal__title">
        <h1>
          <img src="/assets/img/food.svg" alt="" />
          <span *ngIf="meal$ | async as meal; else title">
            {{ meal.name ? 'Edit' : 'Create' }} meal
          </span>
          <ng-template #title> Loading... </ng-template>
        </h1>
      </div>
      <div *ngIf="meal$ | async as meal; else loading">
        <meal-form
          [meal]="meal"
          (create)="addMeal($event)"
          (update)="updateMeal($event)"
          (remove)="removeMeal()"
        >
        </meal-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/img/loading.svg" alt="" />
          Fetching meal...
        </div>
      </ng-template>
    </div>
  `,
})
export class MealComponent implements OnInit, OnDestroy {
  meal$: Observable<Meal> = this.route.params.pipe(
    switchMap((param) => this.mealsService.getMeal(param['id'])),
  );
  subscription: Subscription = this.mealsService.meals$.subscribe();

  constructor(
    private mealsService: MealsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // this.subscription = this.mealsService.meals$.subscribe();
    // this.meal$ =
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async addMeal(event: Meal) {
    await this.mealsService.addMeal(event);
    this.backToMeals();
  }

  async updateMeal(event: Meal) {
    const key = this.route.snapshot.params['id'];
    await this.mealsService.updateMeal(key, event);
    this.backToMeals();
  }

  async removeMeal() {
    const key = this.route.snapshot.params['id'];
    await this.mealsService.removeMeal(key);
    this.backToMeals();
  }

  backToMeals() {
    this.router.navigate(['meals']);
  }
}
