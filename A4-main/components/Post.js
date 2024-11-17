import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";

import Theme from "@/assets/theme";
import db from "@/database/db";

export default function Post({
  shouldNavigateOnPress = false,
  id,
  username,
  timestamp,
  text,
  score,
  commentCount,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(score);

  const submitVote = async (newVote) => {
    setIsLoading(true);
    try {
      // Update the local state immediately for a responsive UI
      let updatedScore = currentScore;

      if (newVote === 0) {
        // User is reverting their vote
        updatedScore -= currentScore > 0 ? 1 : -1;
      } else {
        // User is voting or changing their vote
        updatedScore += newVote;
      }

      setCurrentScore(updatedScore);

      // Update the score in the database (if applicable)
      const response = await db
        .from("posts_with_counts")
        .update({ score: updatedScore })
        .eq("id", id);

      if (response.error) throw response.error;
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  let post = (
    <TouchableOpacity style={styles.content} disabled={!shouldNavigateOnPress}>
      <View style={styles.header}>
        <FontAwesome
          size={Theme.sizes.iconSmall}
          name="user"
          color={Theme.colors.iconSecondary}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <View style={styles.comment}>
          <FontAwesome
            size={Theme.sizes.iconSmall}
            name="comment"
            color={Theme.colors.iconSecondary}
          />
          <Text style={styles.commentCount}>{commentCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (shouldNavigateOnPress) {
    post = (
      <Link
        href={{
          pathname: "/tabs/feed/details",
          params: {
            id: id,
            username: username,
            timestamp: timestamp,
            text: text,
            score: currentScore,
            commentCount: commentCount,
          },
        }}
        asChild={true}
        style={styles.content}
      >
        {post}
      </Link>
    );
  }

  const upvoteButton = (
    <TouchableOpacity
      onPress={() => submitVote(currentScore > 0 ? 0 : 1)}
      style={styles.upvoteButton}
      disabled={isLoading}
    >
      <FontAwesome
        size={16}
        name="chevron-up"
        color={
          currentScore > 0
            ? Theme.colors.iconHighlighted
            : Theme.colors.iconSecondary
        }
      />
    </TouchableOpacity>
  );

  const downvoteButton = (
    <TouchableOpacity
      onPress={() => submitVote(currentScore < 0 ? 0 : -1)}
      style={styles.downvoteButton}
      disabled={isLoading}
    >
      <FontAwesome
        size={16}
        name="chevron-down"
        color={
          currentScore < 0
            ? Theme.colors.iconHighlighted
            : Theme.colors.iconSecondary
        }
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {post}
      <View style={styles.scoreContainer}>
        {upvoteButton}
        <Text style={styles.score}>{currentScore}</Text>
        {downvoteButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  body: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  scoreContainer: {
    alignItems: "center",
    marginLeft: 16,
  },
  text: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    fontSize: Theme.sizes.textMedium,
  },
  username: {
    color: Theme.colors.textSecondary,
    fontWeight: "bold",
    marginLeft: 8,
  },
  timestamp: {
    color: Theme.colors.textSecondary,
    flex: 2,
  },
  comment: {
    flexDirection: "row",
    flex: 3,
  },
  commentCount: {
    color: Theme.colors.textSecondary,
    marginLeft: 8,
  },
  score: {
    color: Theme.colors.textHighlighted,
    fontWeight: "bold",
    fontSize: Theme.sizes.textLarge,
  },
  upvoteButton: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  downvoteButton: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
});