# Angular + Spotify integration

> This repository exposes the entire authorization flow with PKCE flow up to the Web Playback SDK using the Angular framework

[![Angular](https://img.shields.io/badge/angular-framework-blue?logo=angular&angular=framework)](https://angular.dev/)
[![Spotify](https://img.shields.io/badge/spotify-developer-green?logo=spotify&spotify=developer)](https://developer.spotify.com/)

## Steps

1. [Create an spotify app](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app)
2. Fill the [environments files](https://github.com/paulo-campos/angular-spotify-integration/tree/main/src/environments) with the:
  - `CLIENT_ID` from the created app
  - `CLIENT_ENCONDED_DATA` base64 using `CLIENT_ID` and `CLIENT_SECRET` from the created app:
```js
 btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
```
3. Fill in the [SCOPES](https://github.com/paulo-campos/angular-spotify-integration/blob/0b8f06a25a3c09662ea2d151938baba24786a590/src/app/shared/constants/spotify.constants.ts#L4) you will need

4. Add `http://localhost:4200/spotify-authorization` in **Redirect URIs** in the created app settings

5. Run the application:
```shell
$ npm install
$ npm start
```

And the witchcraft is done 🧙

---

**Give this repo a star :star: :arrow_up:.**