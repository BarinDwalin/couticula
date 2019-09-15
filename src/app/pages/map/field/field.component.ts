import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Cell } from '@models';
import { BattleStateService, MapService, SettingsService, TreasureService } from '@services';

import { EventAttackComponent } from '../event-attack/event-attack.component';
import { EventSearchComponent } from '../event-search/event-search.component';
import { EventTreasuresComponent } from '../event-treasures/event-treasures.component';

@Component({
  selector: 'field',
  templateUrl: 'field.component.html',
  styleUrls: ['field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements OnInit, OnDestroy, AfterViewInit {
  visibleMap: Cell[];
  loading = true;

  private subscriptions: Subscription[] = [];

  get cntX() {
    return this.settingsService.countCellVisibleX;
  }
  get cntY() {
    return this.settingsService.countCellVisibleY;
  }

  constructor(
    public popoverCtrl: PopoverController,
    private cd: ChangeDetectorRef,
    private battleStateService: BattleStateService,
    private mapService: MapService,
    private treasureService: TreasureService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.mapService.visibleMap$.subscribe(map => {
        this.visibleMap = map;
        this.cd.markForCheck();
      })
    );

    this.subscriptions.push(
      this.battleStateService.endEvent$.subscribe(cell => {
        const treasuresCount = this.treasureService.calcTreasuresCountAfterBattle(cell);
        const treasures = this.treasureService.generateTreasure(treasuresCount);

        this.mapService.removeMonstersOnCell(cell.x, cell.y, treasures);
        cell = this.mapService.getCell(cell.x, cell.y);

        const popover = this.popoverCtrl.create({
          component: EventTreasuresComponent,
          componentProps: { cell },
          cssClass: 'popover-event-treasures',
        });
        popover.then(p => p.present());
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
      this.cd.markForCheck();
    }, 1500);
  }

  onCellSelected(cell: Cell) {
    console.log(cell);
    if (!this.loading && !!cell) {
      this.mapService.setCurrentPosition(cell.x, cell.y);
    }
  }
  onCellSelectedEvent(cell: Cell) {
    if (!this.loading && !!cell) {
      if (!cell.isClear) {
        this.showEventAttackComponent(cell);
      } else if (!cell.isTravel) {
        this.showEventSearchComponent(cell);
      } else if (cell.treasures.length > 0) {
        this.showEventWinComponent(cell);
      } else if (cell.cave) {
        this.mapService.setCurrentPosition(cell.cave.x, cell.cave.y);
      }
    }
  }
  swipeEvent(e) {
    console.clear();
    console.log(e);
  }

  getFloor(value: number) {
    return Math.floor(value);
  }

  private async showEventAttackComponent(cell: Cell) {
    const popover = await this.popoverCtrl.create({
      component: EventAttackComponent,
      componentProps: { cell },
      cssClass: 'popover-event-attack',
    });
    return await popover.present();
  }
  private async showEventSearchComponent(cell: Cell) {
    const popover = await this.popoverCtrl.create({
      component: EventSearchComponent,
      componentProps: { cell },
      cssClass: 'popover-event-search',
    });
    return await popover.present();
  }
  private async showEventWinComponent(cell: Cell) {
    const popover = await this.popoverCtrl.create({
      component: EventTreasuresComponent,
      componentProps: { cell },
      cssClass: 'popover-event-treasures',
    });
    return await popover.present();
  }
}
