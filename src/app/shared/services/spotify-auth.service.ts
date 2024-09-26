import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import {
  Observable,
  from
} from 'rxjs';
import { map } from 'rxjs/operators';

import { ENVIRONMENT } from '@environment';
import { ISpotifyJWT } from '@interfaces';
import {
  SPOTIFY,
  ROUTES
} from '@constants';

const API_SPOTIFY_AUTHORIZE = `${SPOTIFY.API_ACCOUNTS}/authorize`;
const API_SPOTIFY_API_TOKEN = `${SPOTIFY.API_ACCOUNTS}/api/token`;

@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {
  constructor(private httpClient: HttpClient) {}

  /*
    https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
  */
  getAuthCodeFlowURL(): Observable<{
    codeVerifier: string;
    authorizationURL: string;
  }> {
    const possibilities = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(64));
    const codeVerifier = values.reduce((acc, x) => acc + possibilities[x % possibilities.length], '');
    const base64encode = async (plain: string) => {
      const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(plain)
      );

      return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    return from(base64encode(codeVerifier))
      .pipe(map(code_challenge => ({
        codeVerifier,
        authorizationURL: (
          `${API_SPOTIFY_AUTHORIZE}?`+
          `response_type=code&` +
          `code_challenge_method=S256&` +
          `scope=${SPOTIFY.SCOPES}&` +
          `client_id=${ENVIRONMENT.SPOTIFY.CLIENT_ID}&` +
          `redirect_uri=${window.location.origin}/${ROUTES.SPOTIFY_AUTHORIZATION}&` +
          `code_challenge=${code_challenge}`
        )
      })));
  }

  /*
    https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
  */
  getAccessToken(
    code_verifier: string, code: string
  ): Observable<ISpotifyJWT> {
    const params = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', ENVIRONMENT.SPOTIFY.CLIENT_ID)
      .set('code_verifier', code_verifier)
      .set('redirect_uri', `${window.location.origin}/${ROUTES.SPOTIFY_AUTHORIZATION}`)
      .set('code', code);

    return this.httpClient.post<ISpotifyJWT>(
      API_SPOTIFY_API_TOKEN,
      null,
      { params }
    );
  }

  /*
    https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
  */
  getRefreshToken(refresh_token: string): Observable<ISpotifyJWT> {
    const headers = new HttpHeaders()
      .set('Authorization', `Basic ${ENVIRONMENT.SPOTIFY.CLIENT_ENCONDED_DATA}`);

    const params = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', ENVIRONMENT.SPOTIFY.CLIENT_ID)
      .set('refresh_token', refresh_token);

    return this.httpClient.post<ISpotifyJWT>(
      API_SPOTIFY_API_TOKEN,
      null,
      { headers, params }
    );
  }
}
