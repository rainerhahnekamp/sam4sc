import { createScAction } from './create-sc-action';

describe('createScAction', () => {
  it.todo('should map nothing when no dependencies are required');
  it.todo('should transfer providers');
  it.todo('should transfer when module and component are in different directories');
  it.todo('should transfer inline scam');
  it.todo('should transfer to component with componentProviders');
  it.todo('should work on file with multiple components');

  it('should map without imports', () => {
    const moduleTs = `
import { NgModule } from '@angular/core';
import { ScamComponent } from './scam.component';

@NgModule({
  declarations: [ScamComponent]
})
export class ScamComponentModule {}
`;

    const componentTs = `
import { Component } from '@angular/core';

@Component({
  selector: 'pps-scam',
  template: ''
})
export class ScamComponent {}`;

    const scComponentTs = `
import { Component } from '@angular/core';

@Component({
standalone: true,
  selector: 'pps-scam',
  template: ''
})
export class ScamComponent {}`;

    const scAction = createScAction('module.ts', moduleTs, 'component.ts', componentTs);
    expect(scAction.componentContents).toEqual(scComponentTs);
  });

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

    const scComponentTs = `import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BlinkerDirectiveModule } from '../blinker.directive.module';
import { HolidayPipeModule } from '../holiday.pipe.module';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Holiday } from '../holiday';

@Component({
standalone: true,

  imports: [
    CommonModule,
    MatCardModule,
    BlinkerDirectiveModule,
    HolidayPipeModule,
    RouterModule,
    MatButtonModule
  ],
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss']
})
export class HolidayCardComponent {
  @Input() holiday: Holiday | undefined;
}`;

    const scAction = createScAction('module.ts', moduleTs, 'component.ts', componentTs);

    expect(scAction.componentContents).toEqual(scComponentTs);
  });
});
