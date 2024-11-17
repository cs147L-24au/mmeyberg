import { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Keyboard, Alert } from "react-native";
import Theme from "@/assets/theme";
import { useRouter } from "expo-router";
import db from "@/database/db";
import useSession from "@/utils/useSession";

export default function NewPost() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const session = useSession();

  const submitPost = async () => {
    if (inputText.trim().length === 0) {
      Alert.alert("Validation Error", "Post content cannot be empty.");
      return; // Prevent submission of empty posts
    }

    setIsLoading(true);
    try {
      if (!session || !session.user) {
        console.error("User session is not available. Cannot submit post.");
        Alert.alert("Error", "User session is missing. Please log in again.");
        return;
      }

      console.log("Submitting post with session user ID:", session.user.id);

      // Your provided database logic to save the new post
      const response = await db.from("posts").insert({
        text: inputText,
        username: "Anonymous", // Assuming you want anonymous posting
        user_id: session?.user?.id || "Anonymous", // Using the user ID from session
      });

      if (response.error) {
        throw response.error;
      }

      console.log("Post submitted successfully");

      // Navigate back to the feed after submitting the post
      router.back();
    } catch (error) {
      console.error("Error submitting post:", error);
      Alert.alert("Error", "Failed to submit post. Please try again.");
    } finally {
      setIsLoading(false);
      setInputText("");
      Keyboard.dismiss(); // Close the keyboard after submission
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Cancel and Submit Buttons */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.topBarText}>New Post</Text>
        <TouchableOpacity
          onPress={submitPost}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.postAsLabel}>Post as:</Text>
        <Text style={styles.username}>Anonymous</Text>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={"What do you want to share?"}
          placeholderTextColor={Theme.colors.textSecondary}
          multiline
          textAlignVertical="top"
          autoFocus
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  cancelButtonText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.sizes.textMedium,
  },
  topBarText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.sizes.textLarge,
    fontWeight: "bold",
  },
  submitButtonText: {
    color: Theme.colors.action,
    fontSize: Theme.sizes.textMedium,
    fontWeight: "bold",
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  postAsLabel: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.sizes.textSmall,
    marginBottom: 4,
  },
  username: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.sizes.textMedium,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 16,
    borderRadius: 8,
    fontSize: Theme.sizes.textMedium,
    minHeight: 150,
  },
});
