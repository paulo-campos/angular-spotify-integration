import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ISpotifyProfile } from '@interfaces';
import { SPOTIFY } from '@constants';

@Injectable({ providedIn: 'root' })
export class SpotifyUserService {
  constructor(private httpClient: HttpClient) {}

  /*
    https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
  */
  getCurrentUserProfile(): Observable<ISpotifyProfile> {
    return this.httpClient.get<ISpotifyProfile>(SPOTIFY.API_PROFILE);
  }
}