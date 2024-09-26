interface ISpotifyExternalUrl {
  spotify: string;
}

interface ISpotifyReference {
  href: string;
  total: number;
}

interface ISpotifyImage {
  url: string;
  height: number;
  width: number
}

export interface ISpotifyJWT {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface ISpotifyProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: ISpotifyExternalUrl;
  followers: ISpotifyReference;
  href: string;
  id: string;
  images: ISpotifyImage[];
  product: string;
  type: string;
  uri: string;
}

export interface ISpotifyPlaybackState extends Spotify.PlaybackState {
  // Wordkaround for Spotify.PlaybackState interface bug
  shuffle_mode: 0 | 1 | 2
}
