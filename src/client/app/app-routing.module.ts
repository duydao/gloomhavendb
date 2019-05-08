import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { BaseRoutePath, BetterRoute } from './util/routing';

const routes: BetterRoute<BaseRoutePath | '**'>[] = [
  {
    path: BaseRoutePath.Home,
    loadChildren: './+home/home-page.module#HomePageModule',
    pathMatch: 'full',
    data: {
      title: '',
    },
  },
  {
    path: BaseRoutePath.Items,
    loadChildren: './+items/items-page.module#ItemsPageModule',
    data: {
      title: 'Items',
    },
  },

  {
    path: BaseRoutePath.SecretShop,
    loadChildren: './+secret/+shop/secret-shop.module#SecretShopModule',
    data: {
      title: 'Secret Shop',
    },
  },
  {
    path: BaseRoutePath.SecretMap,
    loadChildren: './+secret/+map/secret-map.module#SecretMapModule',
    data: {
      title: 'Secret Map',
    },
  },
  {
    path: BaseRoutePath.SecretEvents,
    loadChildren: './+secret/+events/secret-events.module#SecretEventsModule',
    data: {
      title: 'Secret Events',
    },
  },
  {
    path: BaseRoutePath.SecretBattleGoals,
    loadChildren: './+secret/+battle-goals/secret-battle-goals.module#SecretBattleGoalsModule',
    data: {
      title: 'Secret Battle Goals',
    },
  },
  {
    path: BaseRoutePath.Login,
    loadChildren: './+login/login-page.module#LoginPageModule',
    data: {
      title: 'Login',
    },
  },

  // this item should be last... only shown if no other match
  {
    path: '**',
    loadChildren: './+not-found/not-found-page.module#NotFoundPageModule',
    data: {
      title: 'Page Not Found',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
