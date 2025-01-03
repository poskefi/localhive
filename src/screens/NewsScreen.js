import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CONFIG from './config';

export default function NewsScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const { BASE_URL } = CONFIG;

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPosts(data.map((post) => ({
        ...post,
        comments: post.comments || [],
        image: post.image || 'https://via.placeholder.com/150',
      })));
    } catch (error) {
      console.error('Error fetching posts:', error.message || error);
      Alert.alert('Error', 'Unable to fetch posts. Please try again.');
    }
  };

  const sortPosts = (posts, order) => {
    return posts.sort((a, b) =>
      order === 'latest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'latest' ? 'oldest' : 'latest'));
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like post');
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    } catch (error) {
      console.error('Error liking post:', error.message || error);
      Alert.alert('Error', 'Unable to like post. Please try again.');
    }
  };

  const handleAddComment = async (postId, comment) => {
    if (!comment.trim()) {
      Alert.alert('Validation Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error.message || error);
      Alert.alert('Error', 'Unable to add comment. Please try again.');
    }
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  return (
    <View style={styles.container}>
      {/* Sort Button */}
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Icon name="sort" size={20} color="#fff" />
          <Text style={styles.sortButtonText}>
          {sortOrder === 'latest' ? 'Sort: Latest' : 'Sort: Oldest'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortPosts(posts, sortOrder)}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <TouchableOpacity onPress={() => setSelectedPost(item)}>
              <Image
                source={{ uri: item?.image || 'https://via.placeholder.com/150' }}
                style={styles.postImage}
              />
              <Text style={styles.postTitle}>{item?.title}</Text>
              <Text style={styles.postText}>{item?.description}</Text>
            </TouchableOpacity>
            <View style={styles.interactionRow}>
              <TouchableOpacity onPress={() => handleLike(item?.id)} style={styles.likeButton}>
                <Icon name="thumb-up" size={20} color="#fff" />
                <Text style={styles.buttonText}>Like ({item?.likes || 0})</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentsContainer}>
              <Text style={styles.commentsHeader}>Top Comments:</Text>
              {item.comments.slice(0, 2).map((comment, index) => (
              <View key={index} style={styles.commentCard}>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
            ))}
          </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />

      {/* Modal */}
      {selectedPost && (
        <Modal animationType="slide" transparent={false} visible={!!selectedPost}>
          <ScrollView style={styles.articleContainer}>
            <Image
              source={{ uri: selectedPost?.image || 'https://via.placeholder.com/150' }}
              style={styles.articleImage}
            />
            <Text style={styles.articleTitle}>{selectedPost?.title}</Text>
            <Text style={styles.articleText}>{selectedPost?.description}</Text>
            <View style={styles.articleActions}>
              <TouchableOpacity
                onPress={() => handleLike(selectedPost?.id)}
                style={styles.likeButton}
              >
                <Icon name="thumb-up" size={20} color="#fff" />
                <Text style={styles.buttonText}>Like ({selectedPost?.likes || 0})</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.commentsHeader}>Comments:</Text>
            {(selectedPost?.comments || []).map((comment, index) => (
              <Text key={index} style={styles.commentText}>
                {comment.comment}
              </Text>
            ))}
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              onPress={() => handleAddComment(selectedPost.id, commentText)}
              style={styles.addCommentButton}
            >
              <Text style={styles.addCommentButtonText}>Add Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closePostModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sortButtonText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  postImage: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  postTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  postText: { fontSize: 14, color: '#333', marginBottom: 10 },
  interactionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
  articleContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  articleImage: { width: '100%', height: 300, borderRadius: 10, marginBottom: 15 },
  articleTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  articleText: { fontSize: 16, color: '#333', lineHeight: 24, marginBottom: 20 },
  closeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  addCommentButton: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
  },
  addCommentButtonText: { color: '#fff', fontWeight: 'bold' },
  commentsHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  commentText: { fontSize: 14, color: '#555', marginTop: 5 },

  commentsContainer: {
    marginTop: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  commentsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  commentText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
});
