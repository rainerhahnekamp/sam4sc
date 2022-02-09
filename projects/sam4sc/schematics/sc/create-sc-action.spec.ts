import { createScAction } from './create-sc-action';

describe('createScAction', () => {
  it.todo('should map nothing when no dependencies are required');
  it.todo('should transfer providers');
  it.todo('should transfer when module and component are in different directories');
  it.todo('should transfer inline scam');
  it.todo('should transfer to component with componentProviders');
  it.todo('should work on file with multiple components');

  it("should map a module's import to component", () => {
    const moduleTs = `
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BlinkerDirectiveModule } from '../blinker.directive.module';
import { HolidayPipeModule } from '../holiday.pipe.module';
import { HolidayCardComponent } from './holiday-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HolidayCardComponent],
  exports: [HolidayCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    BlinkerDirectiveModule,
    HolidayPipeModule,
    RouterModule,
    MatButtonModule
  ]
})
export class HolidayCardComponentModule {}`;

    const componentTs = `
import { Component, Input } from '@angular/core';
import { Holiday } from '../holiday';

@Component({
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss']
})
export class HolidayCardComponent {
  @Input() holiday: Holiday | undefined;
}`;

    const scComponentTs = `
import { Component, Input } from '@angular/core';
import { Holiday } from '../holiday';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BlinkerDirectiveModule } from '../blinker.directive.module';
import { HolidayPipeModule } from '../holiday.pipe.module';
import { HolidayCardComponent } from './holiday-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    BlinkerDirectiveModule,
    HolidayPipeModule,
    RouterModule,
    MatButtonModule
  ]
})
export class HolidayCardComponent {
  @Input() holiday: Holiday | undefined;
}`;

    const scAction = createScAction('module.ts', moduleTs, 'component.ts', componentTs);

    expect(scAction).toEqual({
      modulePath: 'module.ts',
      componentPath: 'component.ts',
      deleteModule: true,
      componentContents: scComponentTs
    });
  });
});
