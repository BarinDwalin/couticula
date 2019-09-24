import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BattlePage, ChoiceHeroPage, MapPage, ShopPage } from './pages';

const routes: Routes = [
  {
    path: 'start-page',
    loadChildren: () => import('./pages/start/start.module').then(m => m.StartModule),
  },
  {
    path: 'battle',
    component: BattlePage,
    pathMatch: 'full',
  },
  {
    path: 'choice-hero',
    component: ChoiceHeroPage,
    pathMatch: 'full',
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
    component: MapPage,
    pathMatch: 'full',
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
    component: ShopPage,
    pathMatch: 'full',
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
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
