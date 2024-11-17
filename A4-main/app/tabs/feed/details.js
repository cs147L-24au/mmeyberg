import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Theme from "@/assets/theme";
import db from "@/database/db";
import useSession from "@/utils/useSession";
import timeAgo from "@/utils/timeAgo";

export default function Details({ route }) {
  const { id, username, timestamp, text, score, commentCount } = route.params;
  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await db.from("comments").select("*").eq("post_id", id);
      if (response.error) throw response.error;
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const submitComment = async () => {
    if (inputText.trim().length === 0) {
      Alert.alert("Validation Error", "Comment cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      if (!session || !session.user) {
        console.error("User session is not available. Cannot submit comment.");
        Alert.alert("Error", "User session is missing. Please log in again.");
        return;
      }

      const response = await db.from("comments").insert({
        text: inputText,
        username: "Anon",
        post_id: id,
        user_id: session?.user?.id || "Anonymous",
      });

      if (response.error) throw response.error;
      setInputText("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      Alert.alert("Error", "Failed to submit comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <FontAwesome size={Theme.sizes.iconSmall} name="user" color={Theme.colors.iconSecondary} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Text style={styles.timestamp}>{timeAgo(timestamp)}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>

      <View style={styles.commentsContainer}>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <View style={styles.commentHeader}>
              <FontAwesome size={Theme.sizes.iconSmall} name="user" color={Theme.colors.iconSecondary} />
              <Text style={styles.commentUsername}>{comment.username}</Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
            <Text style={styles.commentTimestamp}>{timeAgo(comment.timestamp)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a comment..."
          placeholderTextColor={Theme.colors.textSecondary}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity onPress={submitComment} disabled={isLoading} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    marginLeft: 8,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
  timestamp: {
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  text: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.sizes.textMedium,
  },
  commentsContainer: {
    marginTop: 16,
  },
  comment: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUsername: {
    marginLeft: 8,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
  commentText: {
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  commentTimestamp: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.sizes.textSmall,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    fontSize: Theme.sizes.textMedium,
  },
  submitButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: Theme.colors.action,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
