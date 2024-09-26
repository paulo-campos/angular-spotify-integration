import { Routes } from '@angular/router';
import { ROUTES } from '@constants';

import { SpotifyAuthorizationComponent } from './pages/spotify-authorization/spotify-authorization.component';
import { AuthComponent } from './pages/auth/auth.component';
import { PlayerComponent } from './pages/player/player.component';

export const appRoutes: Routes = [
  {
    path: 'spotify-authorization',
    component: SpotifyAuthorizationComponent
  },
  {
    path: ROUTES.AUTH,
    component: AuthComponent
  },
  {
    path: ROUTES.PLAYER,
    component: PlayerComponent
  },
  {
    path: '**',
    redirectTo: ROUTES.AUTH,
    pathMatch: 'full'
  }
];
