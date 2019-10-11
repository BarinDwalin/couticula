import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { GameService } from '@services';
import { interval } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'page-single',
  templateUrl: 'single.page.html',
  styleUrls: ['single.page.scss'],
})
export class SinglePage implements OnInit {
  private progress = 0;

  get progressNormalize() {
    return this.progress / 100;
  }

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.gameService
      .startGame()
      // TODO: расчет загрузки ресурсов
      .then(() => this.pseudoProgress())
      .then(() => {
        this.openFirstGamePage();
      });
  }

  pseudoProgress() {
    const loadTime = 500;
    const steps = 10;
    return new Promise(resolver => {
      interval(loadTime / steps)
        .pipe(
          take(steps),
          finalize(() => resolver())
        )
        .subscribe(() => {
          this.progress += 100 / steps;
        });
    });
  }

  openFirstGamePage() {
    this.router.navigateByUrl('/choice-hero');
    // this.navCtrl.setPages([{ page: MapPage }, { page: ShopPage }, { page: ChoiceHeroPage }]);
  }
}
