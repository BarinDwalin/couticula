import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { GameMode } from '@enums';
import { EnemyGroupFabric } from '@fabrics';
import { Cell, Item } from '@models';

import { RandomService } from './random.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  visibleMap$: Observable<Cell[]>;

  private gameMap: Cell[][];
  private visibleMapSource: BehaviorSubject<Cell[]> = new BehaviorSubject<Cell[]>([]);
  private xCurrentMap: number;
  private yCurrentMap: number;

  get map() {
    return this.gameMap;
  }

  constructor(private settingsService: SettingsService, private randomService: RandomService) {
    this.visibleMap$ = this.visibleMapSource.asObservable();
  }

  createMap(): Promise<void> {
    return new Promise<void>(resolve => {
      this.gameMap = [];
      this.xCurrentMap = 0;
      this.yCurrentMap = 0;
      this.createEntryPoint(this.xCurrentMap, this.yCurrentMap);
      resolve();
    });
  }
  getCell(x: number, y: number): Cell {
    if (this.isEmptyCell(x, y)) {
      return null;
    }
    const cell = this.map[x][y];
    cell.img = this.getCellImage(cell);
    return cell;
  }
  isEmptyCell(x: number, y: number) {
    if (this.gameMap[x] == null || this.gameMap[x][y] == null) {
      return true;
    }
    return false;
  }
  removeMonstersOnCell(x: number, y: number, treasures: Item[]) {
    if (!this.isEmptyCell(x, y) && !this.map[x][y].isWall) {
      this.map[x][y] = this.map[x][y].copy();
      this.map[x][y].isClear = true;
      this.map[x][y].treasures = treasures;
      this.generateOneWay(x, y);
      this.visibleMapSource.next(this.getVisibleMap());
    }
  }
  markCellAsInvestigated(x: number, y: number) {
    if (!this.isEmptyCell(x, y) && !this.map[x][y].isWall) {
      this.map[x][y] = this.map[x][y].copy();
      this.map[x][y].isTravel = true;
      this.visibleMapSource.next(this.getVisibleMap());
    }
  }
  removeTreasureOnCellByIndex(x: number, y: number, index: number) {
    if (this.map[x][y].treasures && this.map[x][y].treasures.length > index) {
      const item = this.map[x][y].treasures.splice(index, 1)[0];
      if (this.map[x][y].treasures.length === 0) {
        this.map[x][y] = this.map[x][y].copy();
        this.visibleMapSource.next(this.getVisibleMap());
      }
      return item;
    }
  }
  setCurrentPosition(x: number, y: number) {
    this.xCurrentMap = x;
    this.yCurrentMap = y;
    this.visibleMapSource.next(this.getVisibleMap());
  }
  generateSecretPath(x: number, y: number) {
    const secretPath = this.tryCreateSecretPath();

    if (secretPath) {
      const currentCell = this.getCell(x, y);
      this.createEntryPoint(secretPath.x, secretPath.y, currentCell.deep);
      const targetCell = this.getCell(secretPath.x, secretPath.y);
      targetCell.cave = { x, y };
      currentCell.cave = { x: secretPath.x, y: secretPath.y };
      return true;
    } else {
      return false;
    }
  }

  private tryCreateSecretPath() {
    const radius = 5;
    const tryCount = 10; // защита от зацикливания на больших картах
    let xCave: number, yCave: number;

    for (let count = 0; count < tryCount; count++) {
      xCave = this.xCurrentMap + this.randomService.getInt(-radius, radius);
      yCave = this.yCurrentMap + this.randomService.getInt(-radius, radius);
      if (this.isEmptyCell(xCave, yCave)) {
        return {
          x: xCave,
          y: yCave,
        };
      }
    }
    return null;
  }

  private getVisibleMap() {
    const map: Cell[] = [];
    const cntX = this.settingsService.countCellVisibleX;
    const cntY = this.settingsService.countCellVisibleY;
    for (let i = cntY - 1; i >= 0; i--) {
      for (let j = 0; j < cntX; j++) {
        const yGlobal = this.yCurrentMap + i - Math.floor(cntY / 2);
        const xGlobal = this.xCurrentMap + j - Math.floor(cntX / 2);
        map.push(this.getCell(xGlobal, yGlobal));
      }
    }
    return map;
  }
  private createEmptyCell(x: number, y: number): Cell {
    const cell: Cell = new Cell(x, y);
    if (this.gameMap[x] == null) {
      this.gameMap[x] = [];
    }
    this.gameMap[x][y] = cell;
    return this.gameMap[x][y];
  }
  private createEntryPoint(x: number, y: number, deep = 0) {
    const cell = this.createEmptyCell(x, y);
    cell.deep = deep;
    cell.isWall = false;
    cell.isClear = true;
    cell.isTravel = true;
    this.generateOneWay(x, y);
    this.visibleMapSource.next(this.getVisibleMap());
  }
  private generateOneWay(x: number, y: number) {
    const deep = this.gameMap[x][y].deep;
    let waysCount = this.getWaysCount(deep);
    // this.gameMap[x][y].ways = waysCount.toString();

    if (this.isEmptyCell(x + 1, y)) {
      this.createEmptyCell(x + 1, y);
    }
    if (this.isEmptyCell(x - 1, y)) {
      this.createEmptyCell(x - 1, y);
    }
    if (this.isEmptyCell(x, y + 1)) {
      this.createEmptyCell(x, y + 1);
    }
    if (this.isEmptyCell(x, y - 1)) {
      this.createEmptyCell(x, y - 1);
    }

    const cellRight = this.gameMap[x + 1][y];
    const cellLeft = this.gameMap[x - 1][y];
    const cellTop = this.gameMap[x][y + 1];
    const cellBottom = this.gameMap[x][y - 1];
    // генерация развилок в произвольном порядке
    const directionsWithRandomSort = [cellRight, cellLeft, cellTop, cellBottom]
      .map(p => ({ weight: this.randomService.getFloat(0, 1), cell: p }))
      .sort(p => p.weight);

    for (let i = 0; i < 4; i++) {
      const cell = directionsWithRandomSort[i].cell;
      const isWall = waysCount <= 0;
      const isNewWayCreated = this.tryCreateNewWay(cell, deep, isWall);
      if (isNewWayCreated) {
        waysCount -= 1;
      }
    }
  }
  private createMonsterInCell(cell: Cell) {
    const enemyGroupSettings =
      this.settingsService.gameMode === GameMode.Easy
        ? EnemyGroupFabric.createMostersCasual(cell)
        : EnemyGroupFabric.createMostersTrueHard(cell);

    cell.mosterLevel1Count = enemyGroupSettings.mosterLevel1Count;
    cell.mosterLevel2Count = enemyGroupSettings.mosterLevel2Count;
    cell.doesBossExists = enemyGroupSettings.doesBossExist;
  }
  private getWaysCount(deep: number) {
    // 2-3 для начала и 1-3 иначе
    let waysCount = deep < 4 ? this.randomService.getInt(2, 3) : this.randomService.getInt(1, 6);
    // тупик 50%
    if (waysCount > 3) {
      waysCount = 0;
    }
    return waysCount;
  }
  private tryCreateNewWay(cell: Cell, currentDeep: number, isWall: boolean) {
    if (cell.deep == null) {
      cell.isWall = isWall;
      cell.deep = currentDeep + 1;

      if (!cell.isWall) {
        this.createMonsterInCell(cell);
      }
      return true;
    } else {
      return false;
    }
  }

  private getCellImage(cell: Cell): string {
    if (cell.isWall) {
      return 'assets/img/map/unwalkable-cell.svg';
    } else if (!cell.isClear) {
      return 'assets/img/map/enemy-cell.svg';
    }

    const wayRight = this.doesWayExist(cell, 1, 0);
    const wayLeft = this.doesWayExist(cell, -1, 0);
    const wayTop = this.doesWayExist(cell, 0, 1);
    const wayBottom = this.doesWayExist(cell, 0, -1);
    cell.paths = {
      right: wayRight,
      left: wayLeft,
      top: wayTop,
      bottom: wayBottom,
    };
    return 'assets/img/map/way.svg';
  }

  private doesWayExist(cell: Cell, xDiff: number, yDiff: number) {
    return (
      !this.isEmptyCell(cell.x + xDiff, cell.y + yDiff) &&
      !this.gameMap[cell.x + xDiff][cell.y + yDiff].isWall
    );
  }
}
