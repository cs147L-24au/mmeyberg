import { View, Text, Image, StyleSheet } from "react-native";

const Song = ({ imageUrl, title, artist, album, duration }) => (
  <View style={styles.songContainer}>
    <Image source={{ uri: imageUrl }} style={styles.albumImage} />
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
      <Text style={styles.album}>{album}</Text>
      <Text style={styles.duration}>{duration}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  songContainer: { flexDirection: "row", padding: 10, alignItems: "center" },
  albumImage: { width: 60, height: 60, marginRight: 10 },
  infoContainer: { flex: 1 },
  title: { fontWeight: "bold" },
  artist: { color: "gray" },
  album: { fontStyle: "italic" },
  duration: { color: "darkgray" },
});

export default Song;
