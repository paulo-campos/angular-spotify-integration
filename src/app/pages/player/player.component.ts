///  <reference types="@types/spotify-web-playback-sdk"/>

import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  SPOTIFY,
  STORAGE
} from '@constants';
import {
  ISpotifyJWT,
  ISpotifyProfile,
  ISpotifyPlaybackState
} from '@interfaces';
import {
  SpotifyUserService,
  StorageService
} from '@services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {
  spotifyUser: ISpotifyProfile = {} as ISpotifyProfile;
  player: any;

  constructor(
    private renderer2: Renderer2,
    private spotifyUserService: SpotifyUserService,
    private storageService: StorageService<ISpotifyJWT>
  ) {}

  ngOnInit(): void {
    const jwt = this.storageService.getLocal(STORAGE.SPOTIFY_JWT);
    const { iframes, scripts } = this.getSDKDependencies();

    if (jwt && !iframes?.length && !scripts?.length) {
      /*
        https://developer.spotify.com/documentation/web-playback-sdk
      */
      window.onSpotifyWebPlaybackSDKReady = () => {
        this.player = new Spotify.Player({
          name: 'Angular + Spotify integration',
          volume: 0.5,
          getOAuthToken: cb => cb(jwt.access_token)
        });

        this.player.connect();

        /*
          https://developer.spotify.com/documentation/web-playback-sdk/reference#events
        */
        this.player.addListener('ready', (
          { device_id }: Spotify.WebPlaybackInstance
        ) => {
          console.log('Ready with Device ID', device_id);
        });

        this.player.addListener('player_state_changed', ({
          position,
          duration,
          track_window: { current_track }
        }: ISpotifyPlaybackState) => {
          console.log('Currently Playing', current_track);
          console.log('Position in Song', position);
          console.log('Duration of Song', duration);
        });

        this.player.addListener('not_ready', (
          { device_id }: Spotify.WebPlaybackInstance
        ) => {
          console.log('Device ID has gone offline', device_id);
        });

        this.player.addListener('autoplay_failed', () => {
          console.log('Autoplay is not allowed by the browser autoplay rules');
        });

        /*
          https://developer.spotify.com/documentation/web-playback-sdk/reference#errors
        */
        this.player.on('initialization_error', (
          { message }: Spotify.Error
        ) => {
          console.error('Failed to initialize', message);
        });

        this.player.on('authentication_error', (
          { message }: Spotify.Error
        ) => {
          console.error('Failed to authenticate', message);
        });

        this.player.on('account_error', (
          { message }: Spotify.Error
        ) => {
          console.error('Failed to validate Spotify account', message);
        });

        this.player.on('playback_error', (
          { message }: Spotify.Error
        ) => {
          console.error('Failed to perform playback', message);
        });
      };

      const script = this.renderer2.createElement('script');
      script.src = SPOTIFY.SDK_SCRIPT;
      script.async = true;

      document.body.appendChild(script);
    }

    // Gets spotify authorized user
    this.spotifyUserService
    .getCurrentUserProfile()
    .subscribe((spotifyUser: ISpotifyProfile) => {
      // Do somenthing useful with this
      this.spotifyUser = spotifyUser;
    });
  }

  private getSDKDependencies(): {
    iframes: NodeListOf<Element>, scripts: NodeListOf<Element>
  } {
    return {
      iframes: document.querySelectorAll(`iframe[src="${SPOTIFY.SDK_IFRAME}"]`),
      scripts: document.querySelectorAll(`script[src="${SPOTIFY.SDK_SCRIPT}"]`)
    }
  }
}
