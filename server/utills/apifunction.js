import axios from "axios";

export const getSpotifyToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENTID;
  const clientSecret = process.env.SPOTIFY_SECRET;
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return res.data.access_token;
};

export const searchSongs = async (query) => {
  const token = await getSpotifyToken();

  const res = await axios.get(`https://api.spotify.com/v1/search`, {
    params: {
      q: query,
      type: 'track',
      limit: 10,
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return res.data.tracks.items.map(track => ({
    id: track.id,
    title: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    preview_url: track.preview_url,
    image: track.album.images[0]?.url,
  }));
};

