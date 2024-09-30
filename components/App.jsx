import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Button,
} from "react-native";

export default function App() {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const fetchData = async (limit = 10) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
      );
      const data = await response.json();
      setPost(data);
      setLoading(false);
    } catch {
      setError("Failed to fetch");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handelRefresh = () => {
    setRefresh(true);
    fetchData(20);
    setRefresh(false);
  };

  const addPost = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "ay",
        body: body,
      }),
    });
    const newPost = await response.json();
    setPost([newPost, ...post]);
    setBody("");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="red" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <>
          <View>
            <TextInput
              placeholder="Post Body"
              value={body}
              onChangeText={setBody}
            />
            <Button title="Add" onPress={addPost} />
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={post}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <Text>{item?.title}</Text>
                    <Text>{item?.body}</Text>
                  </View>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              ListEmptyComponent={<Text>No Post Found</Text>}
              ListHeaderComponent={<Text>Post List</Text>}
              ListFooterComponent={<Text>End Of List</Text>}
              refreshing={refresh}
              onRefresh={handelRefresh}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 2,
  },
});
