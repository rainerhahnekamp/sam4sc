import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HolidaysEffects } from './+state/holidays.effects';
import { holidaysFeature } from './+state/holidays.reducer';
import { HolidayCardComponent } from './holiday-card/holiday-card.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';

@NgModule({
  declarations: [HolidayCardComponent, HolidaysComponent, RequestInfoComponent],
  imports: [
    RouterModule.forChild([
      {
        path: 'holidays',
        children: [
          {
            path: '',
            component: HolidaysComponent
          },
          {
            path: 'request-info/:holidayId',
            component: RequestInfoComponent
          }
        ]
      }
    ]),
    StoreModule.forFeature(holidaysFeature),
    EffectsModule.forFeature([HolidaysEffects]),
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class HolidaysModule {}
