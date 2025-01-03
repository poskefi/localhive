const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Handle creating a new post
router.post('/', async (req, res) => {
  try {
    const { title, description, category, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }
    if (image.length > 500) {
  return res.status(400).json({
    error: "Image URL exceeds maximum length of 500 characters.",
  });
}

    const newPost = await Post.create({ title, description, category, image });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1; // Increment likes
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Error liking post:', error.message || error);
    res.status(500).json({ error: 'Failed to like post', details: error.message });
  }
});


router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments = [...(post.comments || []), { comment }];
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Error adding comment:', error.message || error);
    res.status(500).json({ error: 'Failed to add comment', details: error.message });
  }
});




// Handle fetching all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

module.exports = router;
