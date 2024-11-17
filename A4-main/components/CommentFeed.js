import { useState } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";

import Theme from "@/assets/theme";
import Comment from "./Comment";
import Loading from "./Loading";

import timeAgo from "@/utils/timeAgo";
import { useLocalSearchParams } from "expo-router";

export default function CommentFeed({ postId }) {
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //----
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      if (postId.id){
            
        const response = await db
          .from("comments") // Ensure table name is correct
          .select("*")
          .eq("post_id", postId);
        if (response.data){
          setComments(response.data);
          console.log("Comments:", comments);

        }
      }
    } catch (err){
      console.log(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  //----

  if (isLoading && !isRefreshing) {
    return <Loading />;
  }

  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => (
        <Comment
          username={item.username}
          timestamp={timeAgo(item.timestamp)}
          text={item.text}
        />
      )}
      contentContainerStyle={styles.posts}
      style={styles.postsContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            fetchComments();
          }}
          tintColor={Theme.colors.textPrimary} // only applies to iOS
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  postsContainer: {
    marginTop: 24,
  },
  posts: {
    gap: 8,
  },
});
