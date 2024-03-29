const express = require('express');
const { ValidateOptions } = require('../../../config/validation/validation.config');
const { createPostSchema, searchPostsSchema, updatePostSchema } = require('./post.validation');
const { createPostService, getPostByIdService, searchPostsService, getHomefeedService, updatePostService, deletePostService } = require('./post.service');
const { internalErrorHandler } = require('../../utilities/errorHandlers/internalErrorHandler');

const app = express();

app.post('/', async function createPost(req, res) {
  try {
    const { value: postDetails, error } = createPostSchema.validate(req.body, ValidateOptions);
    if (error) {
      throw error;
    }

    await createPostService(postDetails);
    res.sendStatus(201);
  } catch (error) {
    console.log('[Post Controller]');
    internalErrorHandler(res, error);
  }
});

app.get('/:id', async function getPostById(req, res) {
  try {
    const post = await getPostByIdService(req.params.id);

    post ? res.json(post) : res.sendStatus(404);
  } catch (error) {
    console.log('[Post Controller]:', error);
    res.sendStatus(500);
  }
});

app.post('/search', async function searchPosts(req, res) {
  try {
    const { value: searchPosts, error } = searchPostsSchema.validate(req.body, ValidateOptions);
    if (error) {
      throw error;
    }

    const posts = await searchPostsService(searchPosts);
    res.status(200).json(posts);
  } catch (error) {
    console.log('[Post Controller]');
    internalErrorHandler(res, error);
  }
});

app.get('/homefeed/:userId', async function getHomefeed(req, res) {
  try {
    const userId = req.params.userId;
    const paginateOptions = {
      limit: parseInt(req.query?.limit),
      offset: parseInt(req.query?.offset),
    };
    const posts = await getHomefeedService(userId, paginateOptions);

    res.status(200).json(posts);
  } catch (error) {
    console.log('[Post Controller]:', error);
    res.sendStatus(500);
  }
});

app.patch('/:id', async function updatePost(req, res) {
  try {
    const { value: updatePost, error } = updatePostSchema.validate(req.body, ValidateOptions);
    if (error) {
      throw error;
    }
    const countAffectedRows = await updatePostService(req.params.id, updatePost);

    countAffectedRows == 1 ? res.sendStatus(200) : res.sendStatus(404);
  } catch (error) {
    console.log('[Post Controller]');
    internalErrorHandler(res, error);
  }
});

app.delete('/:id', async function deletePost(req, res) {
  try {
    const countAffectedRows = await deletePostService(req.params.id);

    countAffectedRows == 1 ? res.sendStatus(200) : res.sendStatus(404);
  } catch (error) {
    console.log('[Post Controller]:', error);
    res.sendStatus(500);
  }
});

module.exports.PostController = app;
