import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Subscription, interval, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { SearchEventType } from '@enums';
import { Cell, EventSearch, Hero } from '@models';
import { EventSearchService, HeroService, MapService, SettingsService } from '@services';
import { DiceComponent } from '@shared/components';

@Component({
  selector: 'event-search',
  templateUrl: 'event-search.component.html',
  styleUrls: ['event-search.component.scss'],
})
export class EventSearchComponent implements OnInit, OnDestroy {
  @ViewChild(DiceComponent, { static: true })
  dice: DiceComponent;

  cell: Cell;
  lastEvent: { type: SearchEventType; text: string | number };
  isShownDice = false;
  investigated = false;
  isInvestigated = false;

  private selectedHero: Hero;
  private subscription: Subscription;

  get heroes() {
    return this.heroService.heroes;
  }

  constructor(
    private params: NavParams,
    private popoverController: PopoverController,
    private eventSearchService: EventSearchService,
    private heroService: HeroService,
    private mapService: MapService,
    private settingsService: SettingsService
  ) {
    this.cell = this.params.get('cell');
    this.selectedHero = this.heroes[0];
  }

  ngOnInit() {
    this.subscription = zip([
      this.eventSearchService.events$,
      interval(this.settingsService.eventsDelay),
    ])
      .pipe(map(value => value[0] as EventSearch))
      .subscribe(event => {
        console.log(event);
        this.lastEvent = event;

        switch (event.type) {
          case SearchEventType.ThrowDice:
            this.isShownDice = true;
            this.dice.animate(event.dice, this.settingsService.eventsDelay);
            break;
          case SearchEventType.SearchIsCompleted:
            this.isShownDice = false;
            this.isInvestigated = false;
            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

    if (this.investigated) {
      this.mapService.markCellAsInvestigated(this.cell.x, this.cell.y);
    }
  }

  search() {
    this.eventSearchService.createRandomEvent(this.cell);
    this.isInvestigated = true;
    this.investigated = true;
  }

  close() {
    this.popoverController.dismiss();
  }
}
