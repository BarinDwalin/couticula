import { Component, Input } from '@angular/core';

import { Hero } from '@models';

@Component({
  selector: 'hero-info-short',
  templateUrl: 'hero-info-short.component.html',
  styleUrls: ['hero-info-short.component.scss'],
})
export class HeroInfoShortComponent {
  @Input()
  hero: Hero;
  @Input()
  isSelected: boolean;
}
