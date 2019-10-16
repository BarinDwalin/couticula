import { Injectable } from '@angular/core';

import { CreatureType } from '../enums';
import { Cell, Hero, Monster } from '../models';
import { HeroService } from './hero.service';

type Character = Hero | Monster;

@Injectable({
  providedIn: 'root',
})
export class BattleStoreService {
  private cell: Cell;
  private currentCharacterIndex: number;
  private currentRound: number;
  private currentHeroTargetId: number;
  private currentMonstersTargetId: number;
  private characters: Character[];

  constructor(private heroService: HeroService) {}

  getCell() {
    return this.cell;
  }

  setCell(cell: Cell) {
    this.cell = cell;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  setCurrentRound(currentRound: number) {
    this.currentRound = currentRound;
  }

  getCurrentCharacter() {
    return this.characters[this.currentCharacterIndex];
  }

  getCurrentCharacterIndex() {
    return this.currentCharacterIndex;
  }

  setCurrentCharacter(index: number) {
    this.currentCharacterIndex = index;
  }

  getCurrentHeroTarget() {
    return this.characters.find(target => target.id === this.currentHeroTargetId);
  }

  setCurrentHeroTarget(currentHeroTargetId: number) {
    this.currentHeroTargetId = currentHeroTargetId;
  }

  getCurrentMonstersTarget() {
    return this.characters.find(target => target.id === this.currentMonstersTargetId);
  }

  setCurrentMonstersTarget(currentMonstersTargetId: number) {
    this.currentMonstersTargetId = currentMonstersTargetId;
  }

  getCharacters() {
    return this.characters;
  }

  setCharacters(characters: Character[]) {
    return (this.characters = characters);
  }

  updateCharacter(newCharacter: Character) {
    const index = this.characters.findIndex(character => character.id === newCharacter.id);
    if (index !== -1) {
      this.characters[index] = newCharacter;
    }
    if (newCharacter.type === CreatureType.Hero) {
      this.updateHero(newCharacter);
    }
  }

  private updateHero(newHero: Hero) {
    const index = this.heroService.heroes.findIndex(hero => hero.id === newHero.id);
    if (index !== -1) {
      this.heroService.heroes[index] = newHero;
    }
  }
}
