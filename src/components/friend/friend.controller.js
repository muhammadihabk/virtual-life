const express = require('express');
const { addFriendSchema, searchFriendsSchema } = require('./friend.validation');
const {
  addFriendService,
  searchFriendService,
  removeFriendService,
} = require('./friend.service');
const ValidateOptions = require('../../../config/validation/validation.config');

const app = express();

app.post('/add', async function addFriend(req, res) {
  try {
    const { value: addFriend, error } = addFriendSchema.validate(
      req.body,
      ValidateOptions
    );
    if (error) {
      throw error;
    }

    await addFriendService(addFriend);
    res.sendStatus(201);
  } catch (error) {
    console.log('[Friend Controller]:', error);
    if (error.details) {
      const errorMessages = error.details.map((element) => element.message);
      res.status(400).json(errorMessages);
    } else {
      res.sendStatus(500);
    }
  }
});

app.post('/search/:userId', async function searchFriends(req, res) {
  try {
    const { value: searchFriends, error } = searchFriendsSchema.validate(
      req.body,
      ValidateOptions
    );
    if (error) {
      throw error;
    }

    const friends = await searchFriendService(req.params.userId, searchFriends);
    res.status(200).json(friends);
  } catch (error) {
    console.log('[Friend Controller]:', error);
    if (error.details) {
      const errorMessages = error.details.map((element) => element.message);
      res.status(400).json(errorMessages);
    } else {
      res.sendStatus(500);
    }
  }
});

app.delete('/:userId/:friendId', async function removeFriend(req, res) {
  let userId =
    req.params.userId < req.params.friendId
      ? req.params.userId
      : req.params.friendId;
  let friendId =
    req.params.userId > req.params.friendId
      ? req.params.userId
      : req.params.friendId;
  try {
    const affectedRows = await removeFriendService(userId, friendId);

    affectedRows === 1 ? res.sendStatus(200) : res.sendStatus(404);
  } catch (error) {
    console.log('[Friend Controller]:', error);
    res.sendStatus(500);
  }
});

module.exports.FriendController = app;