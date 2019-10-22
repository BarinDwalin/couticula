import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Cell } from '@models';

@Component({
  selector: 'cell',
  templateUrl: 'cell.component.html',
  styleUrls: ['cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent implements OnChanges {
  @Input()
  cell: Cell;
  @Output()
  clicked = new EventEmitter();
  @Output()
  clickedEvent = new EventEmitter();

  imageBattleEvent = 'assets/img/map/event-attack.svg';
  imageSearchEvent = 'assets/img/map/search.png';
  imageCave = 'assets/img/map/cave.png';
  imageTreasures = 'assets/img/map/treasure.png';

  get image() {
    if (this.cell) {
      return this.cell.img;
    } else {
      return 'assets/img/map/terra-incognito.svg';
    }
  }
  get existsBattleEvent(): boolean {
    return this.cell && !this.cell.isWall && !this.cell.isClear;
  }
  get existsBoss(): boolean {
    return this.cell && this.cell.doesBossExists && !this.cell.isClear;
  }
  get existsSearchEvent(): boolean {
    return this.cell && !this.cell.isWall && this.cell.isClear && !this.cell.isTravel;
  }
  get existsCave(): boolean {
    return this.cell && !!this.cell.cave;
  }
  get existsTreasures(): boolean {
    return (
      this.cell &&
      !this.cell.isWall &&
      this.cell.isClear &&
      this.cell.isTravel &&
      this.cell.treasures.length > 0
    );
  }

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges() {
    this.cd.markForCheck();
  }
  click() {
    // console.log('qwe');
    this.clicked.emit();
  }
  clickEvent() {
    console.log('clickEvent');
    this.clickedEvent.emit();
  }
}
