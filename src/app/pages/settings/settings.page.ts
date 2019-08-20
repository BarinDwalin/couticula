import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { GameMode } from '@shared/enums';

import { SettingsService } from '@services';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnDestroy {
  gameMode = GameMode;
  settings: FormGroup;

  constructor(public settingsService: SettingsService, public navCtrl: NavController) {
    this.settings = new FormGroup({
      difficult: new FormControl(settingsService.gameMode),
      eventDelay: new FormControl(settingsService.eventsDelay),
      autoWin: new FormControl(settingsService.autoWin),
      battleEventsDelay: new FormControl(settingsService.battleEventsDelay),
      battleDiceDelay: new FormControl(settingsService.battleDiceDelay),
    });
  }

  ngOnDestroy() {
    const model = this.settings.value;

    this.settingsService.gameMode = model.difficult;
    this.settingsService.eventsDelay = model.eventDelay;
    this.settingsService.autoWin = model.autoWin;
    this.settingsService.battleEventsDelay = model.battleEventsDelay;
    this.settingsService.battleDiceDelay = model.battleDiceDelay;
  }

  close() {
    this.navCtrl.back();
  }
}
