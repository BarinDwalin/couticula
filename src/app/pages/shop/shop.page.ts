import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

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
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;
  shopAbilitiesPages: ShopAbilitiesPages;
  tabEquipment: any = EquipmentComponent;
  tabAbilityList: any = AbilityListComponent;
  isSelectedAvailable: boolean;
  isNewHeroAvailable = false;

  private unsubscribe$ = new Subject();

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
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private heroService: HeroService,
    private playerService: PlayerService,
    private shopService: ShopService
  ) {
    this.shopService.isSelectedAvailable$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isSelectedAvailable => {
        this.isSelectedAvailable = isSelectedAvailable;
      });
    this.playerService.gold$
      .pipe(
        switchMap(() => this.shopService.isNewHeroAvailable()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(success => {
        this.isNewHeroAvailable = success;
      });
    this.shopService
      .getShopAbilitesPages()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(shopAbilities => {
        this.shopAbilitiesPages = shopAbilities;
      });
  }

  ngOnInit() {
    this.selectShopPage(ShopPageType.Items);
    this.shopService.selectHero(this.heroes[0]);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  close() {
    this.navCtrl.pop();
  }
  buy() {
    const pageType = this.shopService.choosenPageType;
    if (pageType === ShopPageType.Items) {
      this.shopService.buyEquipment();
    } else {
      this.shopService.buyAbility();
    }
  }

  choseHero(hero: Hero) {
    this.shopService.selectHero(hero);
  }

  addHero() {
    this.shopService
      .getHeroPrice()
      .pipe(
        filter(price => price <= this.playerService.gold),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(price => {
        this.presentAlertNewHeroConfirm(price);
      });
  }

  async presentAlertNewHeroConfirm(price: number) {
    const alert = await this.alertCtrl.create({
      header: 'Купить нового героя?',
      message: `Стоимость ${price} золота`,
      buttons: [
        {
          text: 'Отмена',
          handler: () => {},
        },
        {
          text: 'Купить',
          handler: () => {
            this.shopService
              .buyNewHero()
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe(success => {
                if (success) {
                  this.router.navigateByUrl('/choice-hero');
                }
              });
          },
        },
      ],
    });

    await alert.present();
  }

  selectTab(pageType: ShopPageType) {
    if (pageType !== this.shopService.choosenPageType) {
      this.selectShopPage(pageType);
    }
  }

  private selectShopPage(pageType: ShopPageType) {
    this.shopService.selectPage(pageType);
    this.container.clear();

    const component = this.getPageComponent(pageType);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = this.container.createComponent(componentFactory);
    if (pageType !== ShopPageType.Items) {
      (componentRef.instance as AbilityListComponent).shopAbilitiesPage = this.shopAbilitiesPages.getPage(
        pageType
      );
    }
  }

  getPageComponent(pageType: ShopPageType): Type<AbilityListComponent | EquipmentComponent> {
    switch (pageType) {
      case ShopPageType.Items:
        return EquipmentComponent;
      default:
        return AbilityListComponent;
    }
  }
}
