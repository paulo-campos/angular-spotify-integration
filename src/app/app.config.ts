import {
  ApplicationConfig,
  provideZoneChangeDetection
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { SpotifyInterceptor } from '@core';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpotifyInterceptor,
      multi: true
    }
  ]
};
