const express = require('express');
const { addFriendSchema, searchFriendsSchema } = require('./friend.validation');
const { addFriendService, searchFriendsService, removeFriendService } = require('./friend.service');
const ValidateOptions = require('../../../config/validation/validation.config');
const { internalErrorHandler } = require('../../utilities/errorHandlers/internalErrorHandler');

const app = express();

app.post('/add', async function addFriend(req, res) {
  try {
    const { value: addFriend, error } = addFriendSchema.validate(req.body, ValidateOptions);
    if (error) {
      throw error;
    }

    await addFriendService(addFriend);
    res.sendStatus(201);
  } catch (error) {
    console.log('[Friend Controller]');
    internalErrorHandler(res, error);
  }
});

app.post('/:userId/search', async function searchFriends(req, res) {
  try {
    const userId = req.params.userId;
    const { value: searchFriends, error } = searchFriendsSchema.validate(req.body, ValidateOptions);
    if (error) {
      throw error;
    }

    const friends = await searchFriendsService(userId, searchFriends);
    res.status(200).json(friends);
  } catch (error) {
    console.log('[Friend Controller]');
    internalErrorHandler(res, error);
  }
});

app.delete('/:userId/:friendId', async function removeFriend(req, res) {
  let userId = req.params.userId < req.params.friendId ? req.params.userId : req.params.friendId;
  let friendId = req.params.userId > req.params.friendId ? req.params.userId : req.params.friendId;
  try {
    const affectedRows = await removeFriendService(userId, friendId);

    affectedRows === 1 ? res.sendStatus(200) : res.sendStatus(404);
  } catch (error) {
    console.log('[Friend Controller]:', error);
    res.sendStatus(500);
  }
});

module.exports.FriendController = app;
