const CLIENT_ID = "e1f70e9a4fe04b669378e02c8347c8f5";  // Replace with your Spotify client ID.
const REDIRECT_URI = "exp://10.36.185.163:8081";  // Replace with the correct redirect URI for your device.

const ENV = {
  CLIENT_ID: CLIENT_ID,
  SCOPES: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private",
  ],
  REDIRECT_URI: REDIRECT_URI,
  ALBUM_ID: "2nLOHgzXzwFEpl62zAgCEC",  // Example album ID
  SPOTIFY_API: {
    DISCOVERY: {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    },
    TOP_TRACKS_API: "https://api.spotify.com/v1/me/top/tracks",
    ALBUM_TRACK_API_GETTER: (albumId) => `https://api.spotify.com/v1/albums/${albumId}/tracks`,
  },
};

export default () => ENV;
