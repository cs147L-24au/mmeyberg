import { useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import db from "@/database/db";
import Theme from "@/assets/theme";
import Post from "@/components/Post";
import Loading from "@/components/Loading";

import timeAgo from "@/utils/timeAgo";
import useSession from "@/utils/useSession";

export default function Feed({
  shouldNavigateToComments = false,
  fetchUsersPostsOnly = false,
}) {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const session = useSession();

  useEffect(() => {
    fetchPosts();
  }, [session]);

  const fetchPosts = async () => {
    setIsLoading(true);
    let posts_query = null;
    try {
      if (fetchUsersPostsOnly) {
        // Fetch posts only for the logged-in user
        const response = await db
          .from("posts_with_counts")
          .select("*")
          .eq("user_id", session.user.id);

        if (response.error) throw response.error;
        posts_query = response.data;
      } else {
        // Fetch all posts if fetchUsersPostsOnly is false
        const response = await db.from("posts_with_counts").select("*");

        if (response.error) throw response.error;
        posts_query = response.data;
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setPosts(posts_query || []);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  if (isLoading && !isRefreshing) {
    return <Loading />;
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <Post
          shouldNavigateOnPress={shouldNavigateToComments}
          id={item.id}
          username={item.username}
          timestamp={timeAgo(item.timestamp)}
          text={item.text}
          score={item.like_count}
          commentCount={item.comment_count}
        />
      )}
      contentContainerStyle={styles.posts}
      style={styles.postsContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            fetchPosts();
          }}
          tintColor={Theme.colors.textPrimary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  postsContainer: {
    width: "100%",
  },
  posts: {
    gap: 8,
  },
});
