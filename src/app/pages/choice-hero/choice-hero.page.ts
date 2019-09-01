import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { HeroSettings } from '@models';
import { GameService, HeroService, ShopService } from '@services';

@Component({
  selector: 'page-choice-hero',
  templateUrl: 'choice-hero.page.html',
  styleUrls: ['choice-hero.page.scss'],
})
export class ChoiceHeroPage implements OnInit, OnDestroy {
  heroes: HeroSettings[];

  private subscriptions: Subscription[] = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public gameService: GameService,
    public heroService: HeroService,
    public shopService: ShopService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.heroService.getAllHeroClassesDescription().subscribe(heroes => (this.heroes = heroes))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  selectHero(hero: HeroSettings) {
    const isFirstHero = this.heroService.heroes.length === 0;
    this.heroService.addNewHero(hero.heroClass).then(() => {
      if (isFirstHero) {
        this.navCtrl.navigateBack('/map');
      } else {
        this.navCtrl.navigateBack('/shop');
      }
    });
  }
}
