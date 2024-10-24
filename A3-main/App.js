import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View, Image, Pressable } from 'react-native';
import useSpotifyAuth from './utils/useSpotifyAuth';  // Import the custom hook.
import { getMyTopTracks } from './utils/apiOptions';
import { Themes } from './assets/Themes';
import images from './Themes/images';  // Import Spotify logo.

export default function App() {
  const { token, getSpotifyAuth } = useSpotifyAuth();  // Destructure token and auth function.
  const [tracks, setTracks] = useState(null);  // State to store tracks.

  // Fetch tracks if the token exists.
  useEffect(() => {
    if (token) {
      console.log('Fetching tracks with token:', token);  // Debug log.
      getMyTopTracks(token)
        .then((fetchedTracks) => {
          console.log('Tracks fetched:', fetchedTracks);  // Debug log.
          setTracks(fetchedTracks);  // Store tracks in state.
        })
        .catch((error) => console.error('Error fetching tracks:', error));  // Error handling.
    }
  }, [token]);

  const renderTrack = ({ item }) => (
    <View style={styles.trackContainer}>
      <Image source={{ uri: item.album.images[0].url }} style={styles.albumImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.songTitle}>{item.name}</Text>
        <Text style={styles.songArtist}>{item.artists[0].name}</Text>
      </View>
    </View>
  );

  // Spotify authentication button component.
  const SpotifyAuthButton = () => (
    <Pressable onPress={getSpotifyAuth} style={styles.button}>
      <Image source={images.spotify} style={styles.logo} />
      <Text style={styles.buttonText}>Connect with Spotify</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!token ? (
        <SpotifyAuthButton />  // Show button if not authenticated.
      ) : (
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 25,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  albumImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  songTitle: {
    fontWeight: 'bold',
  },
  songArtist: {
    color: 'gray',
  },
});
