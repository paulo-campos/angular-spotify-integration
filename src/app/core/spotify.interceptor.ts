import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {
  Observable,
  concatMap,
  tap,
  throwError
} from 'rxjs';
import {
  catchError,
  map
} from 'rxjs/operators';

import {
  SPOTIFY,
  SPOTIFY_ERRORS,
  STORAGE
} from '@constants';
import { JWTModel } from '@models';
import {
  StorageService,
  SpotifyAuthService
} from '@services';
import { ISpotifyJWT } from '@interfaces';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {
  constructor(
    private storageService: StorageService<ISpotifyJWT>,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  intercept(
    request: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // If is spotify account requests
    if (request.url.includes(SPOTIFY.API_ACCOUNTS)) {
      return next.handle(
        request.clone({
          // Sets content type header
          headers: request.headers.set(
            'Content-Type', 'application/x-www-form-urlencoded'
          )
        })
      );
    }
    // If is spotify v1 api request
    if (request.url.includes(SPOTIFY.API_V1)) {
      const storedJWT = this.storageService.getLocal(STORAGE.SPOTIFY_JWT);
      // If the JWT was updated within 1 hour
      if ((Date.now() - storedJWT.expires_in) < 3600000) {
        // Sets token authorization header
        return this.setHttpRequest(request, next, storedJWT.access_token)
          .pipe(catchError(error => this.dealWithError(error)));
      } else {
        // Gets refresh token
        return this.spotifyAuthService
          .getRefreshToken(storedJWT.refresh_token)
          .pipe(
            map(refreshedJWT => JWTModel.build(refreshedJWT)),
            // Saves jwt in local storage
            tap(refreshedJWT => this.storageService.setLocal(STORAGE.SPOTIFY_JWT, refreshedJWT)),
            // Handle with initial request using the new token
            concatMap(refreshedJWT => this.setHttpRequest(
              request, next, refreshedJWT.access_token
            )),
            catchError(error => this.dealWithError(error))
          );
      }
    }

    return next.handle(request);
  }

  private setHttpRequest(
    request: HttpRequest<any>, next: HttpHandler, accessToken: string
  ): Observable<HttpEvent<any>> {
    return next.handle(request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${accessToken}`
      )
    }));
  }

  private dealWithError(error: any): Observable<never> {
    // Take some measures
    switch(error.status) {
      case SPOTIFY_ERRORS.BAD_REQUEST:
      //...
    }

    return throwError(() => error);
  }
}
