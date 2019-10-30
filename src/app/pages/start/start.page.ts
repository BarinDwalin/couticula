import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'page-start',
  templateUrl: 'start.page.html',
  styleUrls: ['start.page.scss'],
})
export class StartPage {
  background: string;
  pages: { title: string; route: string; disabled?: boolean }[];

  constructor(private router: Router) {
    this.background = 'assets/img/start-background.jpg';
    this.pages = [
      { title: 'Новая игра', route: '/single' },
      { title: 'Статистика', route: '/statistic' },
      { title: 'Настройки', route: '/settings' },
    ];
  }

  openPage(page) {
    this.router.navigateByUrl(page.route);
  }
}
