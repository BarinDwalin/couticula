import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'start-page',
    loadChildren: () => import('./pages/start/start.module').then(m => m.StartModule),
  },
  {
    path: 'battle',
    loadChildren: () => import('./pages/battle/battle.module').then(m => m.BattleModule),
  },
  {
    path: 'choice-hero',
    loadChildren: () =>
      import('./pages/choice-hero/choice-hero.module').then(m => m.ChoiceHeroModule),
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.module').then(m => m.InventoryModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule),
  },
  {
    path: 'multiplayer',
    loadChildren: () =>
      import('./pages/multiplayer/multiplayer.module').then(m => m.MultiplayerModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: 'shop',
    loadChildren: () => import('./pages/shop/shop.module').then(m => m.ShopModule),
  },
  {
    path: 'single',
    loadChildren: () => import('./pages/single/single.module').then(m => m.SingleModule),
  },
  {
    path: '',
    redirectTo: '/start-page',
    pathMatch: 'full',
  },
  {
    path: 'statistic',
    loadChildren: () =>
      import('./pages/statistic/statistic.module').then(mod => mod.StatisticPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
