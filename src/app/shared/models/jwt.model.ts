import { ISpotifyJWT } from '@interfaces';

export class JWTModel {
  static build(jwt: ISpotifyJWT): ISpotifyJWT {
    return {
      ...jwt,
      expires_in: Date.now() + jwt.expires_in
    };
  }
}
