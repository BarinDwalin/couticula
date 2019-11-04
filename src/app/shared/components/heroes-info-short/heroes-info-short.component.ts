import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Hero } from '@models';

const maxHeroCount = 3;

@Component({
  selector: 'heroes-info-short',
  templateUrl: 'heroes-info-short.component.html',
  styleUrls: ['heroes-info-short.component.scss'],
})
export class HeroesInfoShortComponent implements OnInit {
  @Input()
  heroes: Hero[];
  @Input()
  isNewHeroAvailable = true;
  @Output()
  addedHero = new EventEmitter<void>();
  @Output()
  selectedHero = new EventEmitter<Hero>();

  private currentHero: Hero;
  private newHeroImage = 'assets/img/menu/new-hero.svg';

  get newHeroButtons() {
    const buttons = [];
    buttons.length = maxHeroCount - this.heroes.length;
    buttons.fill(null);
    return buttons;
  }

  ngOnInit() {
    this.currentHero = this.heroes[0];
  }
  addHero() {
    this.addedHero.emit();
  }
  selectHero(hero: Hero) {
    this.currentHero = hero;
    this.selectedHero.emit(hero);
  }
}
