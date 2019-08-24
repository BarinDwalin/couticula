import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ShopPageType } from '@enums';
import { Hero, ShopAbilitiesPages } from '@models';
import { ChoiceHeroPage } from '@pages';
import { HeroService, PlayerService, ShopService } from '@services';

import { AbilityListComponent, EquipmentComponent } from './index';

const maxHeroCount = 3;

@Component({
  selector: 'page-shop',
  templateUrl: 'shop.page.html',
  styleUrls: ['shop.page.scss'],
})
export class ShopPage implements OnInit, OnDestroy {
  @ViewChild('container', { static: true })
  container: ViewContainerRef;

  shopAbilitiesPages: ShopAbilitiesPages;
  tabEquipment: any = EquipmentComponent;
  tabAbilityList: any = AbilityListComponent;
  isSelectedAvailable: boolean;
  isNewHeroAvailable = false;

  private subscriptions: Subscription[] = [];

  get heroes(): Hero[] {
    return this.heroService.heroes;
  }
  get equipmentPage() {
    return { typePage: ShopPageType.Items };
  }
  get selectedHero(): Hero {
    return this.shopService.choosenHero;
  }

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private heroService: HeroService,
    private playerService: PlayerService,
    private shopService: ShopService
  ) {
    this.subscriptions.push(
      this.shopService.isSelectedAvailable$.subscribe(isSelectedAvailable => {
        this.isSelectedAvailable = isSelectedAvailable;
      })
    );
    this.subscriptions.push(
      this.playerService.gold$.subscribe(gold => {
        this.shopService.isNewHeroAvailable().then(success => (this.isNewHeroAvailable = success));
      })
    );
    this.subscriptions.push(
      this.shopService.getShopAbilitesPages().subscribe(shopAbilities => {
        this.shopAbilitiesPages = shopAbilities;
      })
    );
  }

  ngOnInit() {
    this.shopService.isNewHeroAvailable().then(success => (this.isNewHeroAvailable = success));
    this.shopService.selectHero(this.heroes[0]);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  close() {
    this.navCtrl.pop();
  }
  buy() {
    const selectedTab = this.tabRef.getSelected();
    if (selectedTab.tabTitle === 'Снаряжение') {
      this.shopService.buyEquipment();
    } else {
      this.shopService.buyAbility();
    }
  }

  choseHero(hero: Hero) {
    this.shopService.selectHero(hero);
  }
  openPage(page) {
    console.log('openPage ' + page.title);
    //this.navCtrl.push(page.component);
  }
  addHero() {
    this.shopService.getHeroPrice().then(price => {
      if (price > this.playerService.gold) {
        return;
      }
      const confirm = this.alertCtrl.create({
        header: 'Купить нового героя?',
        message: `Стоимость ${price} золота`,
        buttons: [
          {
            text: 'Отмена',
            handler: () => {
              console.log('Disagree clicked');
            },
          },
          {
            text: 'Купить',
            handler: () => {
              console.log('Agree clicked');
              const navTransition = confirm
                .then(() => this.shopService.buyNewHero())
                .then(success => {
                  if (success) {
                    navTransition.then(() => {
                      this.openPage({ title: 'ChoiceHeroPage', component: ChoiceHeroPage });
                    });
                  }
                });
              return false;
            },
          },
        ],
      });
    });
  }

  selectTab(pageType: ShopPageType) {
    this.shopService.selectPage(pageType);
    console.log('pageType', pageType);
  }
}
