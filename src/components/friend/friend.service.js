const {
  addFriendRepository,
  searchFriendsRepository,
  getFriendsSearchPaginateRepository,
  removeFriendRepository,
} = require('./friend.repository');

module.exports.addFriendService = async function addFriendService(addFriend) {
  if (addFriend.virtual_life_user_id > addFriend.friend_id) {
    const temp = addFriend.virtual_life_user_id;
    addFriend.virtual_life_user_id = addFriend.friend_id;
    addFriend.friend_id = temp;
  }
  await addFriendRepository(addFriend);
};

module.exports.searchFriendsService = async function searchFriendsService(
  addFriend
) {
  return {
    friends: await searchFriendsRepository(addFriend),
    paginate: await getFriendsSearchPaginateRepository(addFriend),
  };
};

module.exports.removeFriendService = function removeFriendService(
  userId,
  friendId
) {
  return removeFriendRepository(userId, friendId);
};
