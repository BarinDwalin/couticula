import { Item } from './item';

export class Cell {
  x: number;
  y: number;
  img = 'assets/img/map/black-box.jpg';
  deep: number = null;
  isWall = true;
  ways = '?'; // debug only
  isClear = false; // убиты ли монстры
  isTravel = false; // сработало ли событие
  cave?: { x: number; y: number };
  doesBossExists = false;
  mosterLevel1Count = 0;
  mosterLevel2Count = 0;
  treasures: Item[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    const cell = new Cell(this.x, this.y);
    Object.assign(cell, this);
    return cell;
  }
  name(): string {
    return 'x' + this.x + ' y' + this.y;
  } // debug only
  monster(): string {
    return (
      's-' +
      this.mosterLevel1Count +
      'b-' +
      this.mosterLevel2Count +
      (this.doesBossExists ? 'BB' : '')
    );
  }
}
