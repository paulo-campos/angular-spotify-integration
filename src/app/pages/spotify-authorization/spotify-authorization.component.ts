import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { tap } from 'rxjs/operators';

import {
  ROUTES,
  STORAGE
} from '@constants';
import { ISpotifyJWT } from '@interfaces';
import { JWTModel } from '@models';
import {
  SpotifyAuthService,
  StorageService
} from '@services';

@Component({
  selector: 'app-spotify-authorization',
  standalone: true,
  template: ''
})
export class SpotifyAuthorizationComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spotifyAuthService: SpotifyAuthService,
    private codeVerifierService: StorageService<string>,
    private jwstService: StorageService<ISpotifyJWT>
  ) {}

  ngOnInit(): void {
    // Get code param
    this.activatedRoute.queryParams
      .subscribe(params => {
        // If has no code param
        if (!params['code']) {
          // Redirect to App base
          this.router.navigate([ '' ]);
        // If has code param
        } else {
          // Authenticates the user
          const verifier = this.codeVerifierService.getSession(STORAGE.CODE_VERIFIER);
          const code = params['code'];

          this.spotifyAuthService
            .getAccessToken(verifier, code)
            // Saves spotify JWT
            .pipe(tap(jwt => this.jwstService.setLocal(
              STORAGE.SPOTIFY_JWT, JWTModel.build(jwt)
            )))
            .subscribe({
              next: () => {
                // Redirects to
                this.router.navigate([ ROUTES.PLAYER ]);
              },
              error: () => {
                // TODO error generations token
                this.router.navigate([ '' ]);
              }
            });
        }
      });
  }
}
