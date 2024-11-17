import { useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl, View, Text, TouchableOpacity } from "react-native";
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
  const [sessionAvailable, setSessionAvailable] = useState(false);

  const session = useSession();

  useEffect(() => {
    const checkSession = async () => {
      if (session && session.user) {
        setSessionAvailable(true);
        fetchPosts();
      } else {
        console.error("Session or user information is not available.");
        setSessionAvailable(false);
      }
    };
    checkSession();
  }, [session]);

  const fetchPosts = async () => {
    if (!session || !session.user) {
      console.error("Session is not available. Unable to fetch posts.");
      return;
    }

    setIsLoading(true);
    let posts_query = null;
    try {
      if (fetchUsersPostsOnly) {
        const response = await db
          .from("posts_with_counts")
          .select("*")
          .eq("user_id", session.user.id);

        if (response.error) throw response.error;
        posts_query = response.data;
      } else {
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

  if (!sessionAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>Session data is not available. Please log in again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="rocket" size={24} color={Theme.colors.textPrimary} />
        <Text style={styles.headerText}>Buzz</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (shouldNavigateToComments) {
                console.log("Navigating to comments for post:", item.id);
              }
            }}
          >
            <Post
              shouldNavigateOnPress={shouldNavigateToComments}
              id={item.id}
              username={item.username}
              timestamp={timeAgo(item.timestamp)}
              text={item.text}
              score={item.like_count}
              commentCount={item.comment_count}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.posts}
        style={styles.postsContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              if (session && session.user) {
                fetchPosts();
              }
            }}
            tintColor={Theme.colors.textPrimary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  headerText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.sizes.textLarge,
    fontWeight: "bold",
    marginLeft: 8,
  },
  postsContainer: {
    width: "100%",
    paddingHorizontal: 8,
  },
  posts: {
    gap: 12,
  },
});
