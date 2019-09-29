import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { SearchEventType } from '@enums';
import { Cell, EventSearch, Hero, Item } from '@models';
import { HeroService } from './hero.service';
import { MapService } from './map.service';
import { PlayerService } from './player.service';
import { RandomService } from './random.service';
import { TreasureService } from './treasure.service';

@Injectable({
  providedIn: 'root',
})
export class EventSearchService {
  events$: Observable<EventSearch>;

  private eventsSource = new Subject<EventSearch>();

  constructor(
    private heroService: HeroService,
    private mapService: MapService,
    private playerService: PlayerService,
    private treasureService: TreasureService,
    private randomService: RandomService
  ) {
    this.events$ = this.eventsSource.asObservable();
  }

  createRandomEvent(cell: Cell) {
    // определение наличия события
    let dice = this.randomService.rollDiceD6();
    this.eventsSource.next({
      type: SearchEventType.ThrowDice,
      text: 'Определение наличия события',
      dice,
    });
    if (dice >= 5) {
      this.eventsSource.next({ type: SearchEventType.Smth, text: 'Произошло событие!' });
      // определение масштабности события
      dice = this.randomService.rollDiceD6();
      this.eventsSource.next({
        type: SearchEventType.ThrowDice,
        text: 'Определение масштабности события',
        dice,
      });

      if (dice >= 5) {
        // событие действует на всех персонажей сразу
        this.eventsSource.next({
          type: SearchEventType.AllHeroes,
          text: 'Событие действует на всех!',
        });
        this.createEvent(cell, this.heroService.heroes);
      } else {
        // событие действует на каждого игрока отдельно
        const heroes = this.checkHeroes();
        this.createEvent(cell, heroes);
      }
    } else {
      this.eventsSource.next({ type: SearchEventType.Nothing, text: 'Ничего не случилось' });
    }

    this.eventsSource.next({
      type: SearchEventType.SearchIsCompleted,
      text: 'Пещера исследована',
    });
  }

  private checkHeroes() {
    // шанс срабатывания события(для каждого игрока отдельно)
    const chance = this.randomService.rollDiceD6();
    this.eventsSource.next({
      type: SearchEventType.SeparateHeroes,
      text: `Событие действует на каждого игрока отдельно! (сложность ${chance})`,
    });
    // перебор персонажей
    const heroes: Hero[] = [];
    this.heroService.heroes.forEach(hero => {
      this.eventsSource.next({
        type: SearchEventType.CheckHero,
        text: hero.name,
      });
      const dice = this.randomService.rollDiceD6();
      this.eventsSource.next({ type: SearchEventType.ThrowDice, text: hero.name, dice });
      if (dice >= chance) {
        heroes.push(hero);
        this.eventsSource.next({
          type: SearchEventType.SelectedHero,
          text: hero.name + ' избран судьбой',
        });
      } else {
        this.eventsSource.next({
          type: SearchEventType.NotSelectedHero,
          text: hero.name + ' стоит в стороне',
        });
      }
    });
    return heroes;
  }

  private createEvent(cell: Cell, heroes: Hero[]) {
    if (heroes.length === 0) {
      this.eventsSource.next({ type: SearchEventType.Nothing, text: 'Ничего не случилось' });
      return;
    }

    // определение типа события
    const dice = this.randomService.rollDiceD6();
    this.eventsSource.next({
      type: SearchEventType.ThrowDice,
      text: 'Определение типа события',
      dice,
    });
    if (dice <= 40) {
      this.createGoodEvent(cell, heroes);
    } else {
      this.createBadEvent(heroes);
    }
  }

  private createGoodEvent(cell: Cell, heroes: Hero[]) {
    const dice = this.randomService.rollDiceD6();
    this.eventsSource.next({
      type: SearchEventType.ThrowDice,
      text: 'Положительное событие',
      dice,
    });
    switch (dice) {
      case 1:
      case 2:
      case 3:
      case 4:
        this.findTreasure(heroes);
        break;
      case 5:
        this.restoreHitpoints(heroes);
        break;
      case 6:
        this.findSecretPath(cell, heroes);
        break;
    }
  }

  private createBadEvent(heroes: Hero[]) {
    const dice = this.randomService.rollDiceD6();
    this.eventsSource.next({
      type: SearchEventType.ThrowDice,
      text: 'Негативное событие',
      dice,
    });
    switch (dice) {
      case 1:
      case 2:
        this.lossMoney(heroes);
        break;
      case 3:
      case 4:
        this.lossHitpoints(heroes);
        break;
      case 5:
        this.lossThings(heroes);
        break;
      case 6:
        this.createRandomTrap(heroes);
        break;
    }
  }

  private findTreasure(heroes: Hero[]) {
    this.eventsSource.next({
      type: SearchEventType.FoundTreasure,
      text: 'Найдено сокровище',
    });

    heroes.forEach(hero => {
      const dice = this.randomService.rollDiceD6();
      this.eventsSource.next({ type: SearchEventType.ThrowDice, text: hero.name, dice });

      const item: Item = this.treasureService.generateTreasure(1)[0];
      this.heroService.addItemToInventory(hero, item);
      this.eventsSource.next({
        type: SearchEventType.HeroFoundTreasure,
        text: `${hero.name} нашел ${item.name}`,
      });
    });
  }

  private restoreHitpoints(heroes: Hero[]) {
    this.eventsSource.next({
      type: SearchEventType.FoundSourceHolyWater,
      text: 'Найден целебный родник',
    });

    const hurtHeroes = heroes.filter(hero => hero.hitPoint !== hero.maxHitPoint);
    if (hurtHeroes.length === 0) {
      this.eventsSource.next({
        type: SearchEventType.HeroRestoreHitpoints,
        text: 'Все герои здоровы',
      });
    } else {
      hurtHeroes.forEach(hero => {
        const dice = this.randomService.rollDiceD6();
        this.eventsSource.next({ type: SearchEventType.ThrowDice, text: hero.name, dice });

        const maxHealHitPoint = dice * 5;
        const healHitPoint = this.heroService.healHero(hero.id, maxHealHitPoint);
        this.eventsSource.next({
          type: SearchEventType.HeroRestoreHitpoints,
          text: `${hero.name} вылечен на ${healHitPoint}`,
        });
      });
    }
  }

  private findSecretPath(cell: Cell, heroes: Hero[]) {
    const isCreated = this.mapService.generateSecretPath(cell.x, cell.y);
    if (isCreated) {
      this.eventsSource.next({
        type: SearchEventType.FoundSecretPath,
        text: 'Найден потайной путь!',
      });
    } else {
      this.eventsSource.next({
        type: SearchEventType.Nothing,
        text: 'Найден потайной путь, но он завален',
      });
    }
  }

  private lossMoney(heroes: Hero[]) {
    this.eventsSource.next({
      type: SearchEventType.LossMoney,
      text: 'Потеря денег',
    });

    heroes.forEach(hero => {
      const dice = this.randomService.rollDiceD6();
      this.eventsSource.next({ type: SearchEventType.ThrowDice, text: hero.name, dice });

      const lostGold = this.playerService.lossGold(hero.id);
      this.eventsSource.next({
        type: SearchEventType.HeroLossGold,
        text: `${hero.name} потерял ${lostGold} золотых`,
      });
    });
  }

  private lossHitpoints(heroes: Hero[]) {
    this.eventsSource.next({
      type: SearchEventType.LossHitpoints,
      text: 'Обвал пещеры',
    });

    heroes.forEach(hero => {
      const dice = this.randomService.rollDiceD6();
      this.eventsSource.next({ type: SearchEventType.ThrowDice, text: hero.name, dice });

      const maxDamage = dice * 5;
      const damage = this.heroService.damageHero(hero.id, maxDamage);
      this.eventsSource.next({
        type: SearchEventType.HeroLossHitpoints,
        text: `${hero.name} ранен на ${damage}`,
      });
    });
  }

  private lossThings(heroes: Hero[]) {
    this.eventsSource.next({
      type: SearchEventType.LossThings,
      text: 'Потеря/поломка предмета',
    });

    heroes.forEach(hero => {
      const dice = this.randomService.rollDiceD6();
      this.eventsSource.next({ type: SearchEventType.ThrowDice, text: hero.name, dice });

      const item = this.heroService.loseHeroThing(hero.id);
      this.eventsSource.next({
        type: SearchEventType.HeroLossThing,
        text: `${hero.name} потерял ${item.name}`,
      });
    });
  }

  private createRandomTrap(heroes: Hero[]) {
    // шанс срабатывания (для каждого игрока отдельно)
    const chance = this.randomService.rollDiceD6();
    this.eventsSource.next({
      type: SearchEventType.ExistsTrap,
      text: `Присутствует ловушка! (сложность ${chance})`,
    });

    const dice = this.randomService.rollDiceD6();
    this.eventsSource.next({
      type: SearchEventType.ThrowDice,
      text: 'Определение типа ловушки',
      dice,
    });
    switch (dice) {
      case 1:
      case 2:
      case 3:
        this.createTrapLossHitpoints(heroes, chance);
        break;
      case 4:
      case 5:
        this.createTrapLossThings(heroes, chance);
        break;
      case 6:
        this.createTrapLossAllHitpoints(heroes, chance);
        break;
    }
  }

  private createTrapLossHitpoints(heroes: Hero[], chance: number) {
    this.eventsSource.next({
      type: SearchEventType.TrapLossHitpoints,
      text: 'Персонажи ранены и теряют по 6*бросок жизней',
    });

    heroes.forEach(hero => {
      const isTrapActivated = this.activateTrap(hero, chance);
      if (isTrapActivated) {
        const dice = this.randomService.rollDiceD6();
        const maxDamage = dice * 6;
        const damage = this.heroService.damageHero(hero.id, maxDamage);
        this.eventsSource.next({
          type: SearchEventType.HeroLossHitpoints,
          text: `${hero.name} ранен на ${damage}`,
        });
      }
    });
  }

  private createTrapLossThings(heroes: Hero[], chance: number) {
    this.eventsSource.next({
      type: SearchEventType.TrapLossThings,
      text: 'Персонажи проваливаются в яму и теряют по вещи',
    });

    let countHeroesInTrap = 0;
    heroes.forEach(hero => {
      const isTrapActivated = this.activateTrap(hero, chance);
      if (isTrapActivated) {
        countHeroesInTrap += 1;
        const item = this.heroService.loseHeroThing(hero.id);
        this.eventsSource.next({
          type: SearchEventType.HeroLossThing,
          text: `${hero.name} потерял ${item.name}`,
        });
      }
    });
    this.checkHeroesInTrap(countHeroesInTrap);
  }

  private createTrapLossAllHitpoints(heroes: Hero[], chance: number) {
    this.eventsSource.next({
      type: SearchEventType.TrapLossAllHitpoints,
      text: 'Персонажи проваливаются в яму, остается только 1 жизнь',
    });

    let countHeroesInTrap = 0;
    heroes.forEach(hero => {
      const isTrapActivated = this.activateTrap(hero, chance);
      if (isTrapActivated) {
        countHeroesInTrap += 1;
        const maxDamage = hero.hitPoint - 1;
        const damage = this.heroService.damageHero(hero.id, maxDamage);
        this.eventsSource.next({
          type: SearchEventType.HeroLossHitpoints,
          text: `${hero.name} ранен на ${damage} и при смерти`,
        });
      }
    });

    this.checkHeroesInTrap(countHeroesInTrap);
  }

  private activateTrap(hero: Hero, chance: number) {
    this.eventsSource.next({
      type: SearchEventType.CheckHero,
      text: hero.name,
    });
    const dice = this.randomService.rollDiceD6();
    this.eventsSource.next({ type: SearchEventType.ThrowDice, text: hero.name, dice });
    if (dice >= chance) {
      this.eventsSource.next({
        type: SearchEventType.ActivateTrap,
        text: hero.name + ' попал в ловушку',
      });
      return true;
    } else {
      this.eventsSource.next({
        type: SearchEventType.NotActivateTrap,
        text: hero.name + ' избежал ловушки',
      });
      return false;
    }
  }

  private checkHeroesInTrap(countHeroesInTrap: number) {
    if (countHeroesInTrap === this.heroService.heroes.length) {
      this.eventsSource.next({
        type: SearchEventType.AllHeroesFallen,
        text: 'Все герои провалились и не смогли выбраться',
      });
    }
  }
}
