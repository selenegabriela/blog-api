const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const Post = require('./models/posts');
const port = 3001;
const cors = require('cors');

const app = express();

app.use(cors())
app.use(bodyParser.json());
const PAGE_SIZE = 9;

// Get all blog posts
app.get('/blog-posts', async (req, res, next) => {


  try {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * PAGE_SIZE;
    
    const count = await Post.count();
    const blogPosts = await Post.findAll({
        limit: PAGE_SIZE,
        offset,
        order: [['createdAt', 'DESC']],
      });

      const totalPages = Math.ceil(count / PAGE_SIZE);
      req.posts = blogPosts;
      req.pagination = {page, totalPages};
      next();

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }, (req, res) => {
    const { pagination, posts } = req;
    res.send({posts, pagination});
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
  