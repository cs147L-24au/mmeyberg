import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Theme from '@/assets/theme';

export default function Messages() {
  const messages = [
    { id: '1', user: 'John Doe', lastMessage: 'Hey, are you available?', timestamp: '2h ago' },
    { id: '2', user: 'Jane Smith', lastMessage: 'I sent the document.', timestamp: '5h ago' },
    { id: '3', user: 'Alex Johnson', lastMessage: 'See you at 5 pm!', timestamp: '1d ago' },
  ];

  const renderMessage = ({ item }) => (
    <TouchableOpacity style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: 16,
  },
  messageContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  user: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.sizes.textMedium,
    fontWeight: 'bold',
  },
  timestamp: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.sizes.textSmall,
  },
  lastMessage: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.sizes.textSmall,
  },
  separator: {
    height: 8,
  },
});
