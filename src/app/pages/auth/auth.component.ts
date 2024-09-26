import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';

import {
  ROUTES,
  STORAGE
} from '@constants';
import {
  SpotifyAuthService,
  StorageService
} from '@services';

@Component({
  selector: 'app-auth',
  standalone: true,
  template: ''
})
export class AuthComponent implements OnInit {
  constructor(
    private router: Router,
    private spotifyAuthService: SpotifyAuthService,
    private storageService: StorageService<string>
  ) {}

  ngOnInit(): void {
    // If don't have a token saved in storage
    if (!this.storageService.getLocal(STORAGE.SPOTIFY_JWT)) {
      // Builds Spotify Authorization URL
      this.spotifyAuthService
        .getAuthCodeFlowURL()
        .pipe(tap(({ codeVerifier }) => {
          // Saves the verification code to session storage
          this.storageService.setSession(STORAGE.CODE_VERIFIER, codeVerifier);
        })).subscribe(({ authorizationURL }) => {
            // Redirects to Spotify authorization URL
            !(window.location.href = authorizationURL)
        });
    // If you have user data in the application and a saved token
    } else {
      this.router.navigate([ ROUTES.PLAYER ]);
    }
  }
}
