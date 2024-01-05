const express = require('express');
const {
  ValidateOptions,
} = require('../../../config/validation/validation.config');
const { createCommentSchema, updateCommentSchema } = require('./comment.validation');
const { createCommentService, getCommentsService, updateCommentService, deleteCommentService } = require('./comment.service');

const app = express();

app.post('/', async function createComment(req, res) {
  try {
    const { value: commentDetails, error } = createCommentSchema.validate(
      req.body,
      ValidateOptions
    );
    if (error) {
      throw error;
    }

    await createCommentService(commentDetails);
    res.sendStatus(201);
  } catch (error) {
    console.log('[Comment Controller]:', error);
    if (error.details) {
      const errorMessages = error.details.map((element) => element.message);
      res.status(400).json(errorMessages);
    } else {
      res.sendStatus(500);
    }
  }
});

app.get(
  '/post/:postId/parent-comment-id/:parentCommentId',
  async function getComments(req, res) {
    try {
      const parentCommentId = isNaN(req.params.parentCommentId)
        ? null
        : req.params.parentCommentId;
      const comments = await getCommentsService(
        req.params.postId,
        parentCommentId
      );

      res.json(comments);
    } catch (error) {
      console.log('[Comment Controller]:', error);
      res.sendStatus(500);
    }
  }
);

app.patch('/:id', async function updateComment(req, res) {
  try {
    const { value: commentDetails, error } = updateCommentSchema.validate(
      req.body,
      ValidateOptions
    );
    if (error) {
      throw error;
    }
    const countAffectedRows = await updateCommentService(
      req.params.id,
      commentDetails
    );

    countAffectedRows == 1 ? res.sendStatus(200) : res.sendStatus(404);
  } catch (error) {
    console.log('[Comment Controller]:', error);
    if (error.details) {
      errorMessages = error.details.map((element) => element.message);
      res.status(400).json(errorMessages);
    } else {
      res.sendStatus(500);
    }
  }
});

app.delete('/:id', async function deleteComment(req, res) {
  try {
    const countAffectedRows = await deleteCommentService(req.params.id);

    countAffectedRows == 1 ? res.sendStatus(200) : res.sendStatus(404);
  } catch (error) {
    console.log('[Comment Controller]:', error);
    res.sendStatus(500);
  }
});

module.exports.CommentController = app;