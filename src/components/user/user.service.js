const {
  searchUsersRepository,
  createUserRepository,
  getUserByIdRepository,
  getUsersSearchPaginateRepository,
  updateUserRepository,
  deleteUserRepository,
} = require('./user.repository');

module.exports.createUserService = async function createUserService(
  createUserBody
) {
  await createUserRepository(createUserBody);
};

module.exports.getUserByIdService = function getUserByIdService(userId) {
  return getUserByIdRepository(userId);
};

module.exports.searchUsersService = async function searchUsersService(
  searchOptions
) {
  return {
    users: await searchUsersRepository(searchOptions),
    paginate: await getUsersSearchPaginateRepository(searchOptions),
  };
};

module.exports.updateUserService = function updateUserService(
  userId,
  userBody
) {
  return updateUserRepository(userId, userBody);
};

module.exports.deleteUserService = function deleteUserService(userId) {
  return deleteUserRepository(userId);
};
