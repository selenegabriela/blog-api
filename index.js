const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const Post = require('./models/posts');
const port = 3001

const app = express();

app.use(bodyParser.json());

// Get all blog posts
app.get('/blog-posts', async (req, res) => {
    try {
      const blogPosts = await Post.findAll();
      res.json(blogPosts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get blog post by id
  app.get('/blog-posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const blogPost = await Post.findByPk(id);
      if (!blogPost) {
        res.status(404).json({ message: 'Blog post not found' });
        return;
      }
      res.json(blogPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Create blog post
  app.post('/blog-posts', async (req, res) => {
    try {
      const { title, content } = req.body;
      const blogPost = await Post.create({ title, content });
      res.json(blogPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update blog post
  app.put('/blog-posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const blogPost = await Post.findByPk(id);
      if (!blogPost) {
        res.status(404).json({ message: 'Blog post not found' });
        return;
      }
      blogPost.title = title;
      blogPost.content = content;
      await blogPost.save();
      res.json(blogPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Delete blog post
  app.delete('/blog-posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const blogPost = await Post.findByPk(id);
      if (!blogPost) {
        res.status(404).json({ message: 'Blog post not found' });
        return;
      }
      await blogPost.destroy();
      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Start server
  sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  });
  