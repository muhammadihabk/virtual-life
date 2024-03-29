const { createCommentRepository, getCommentsRepository, updateCommentRepository, deleteCommentRepository } = require('./comment.repository');

module.exports.createCommentService = async function createCommentService(commentDetails) {
  await createCommentRepository(commentDetails);
};

module.exports.getCommentsService = function getCommentsService(commentId) {
  return getCommentsRepository(commentId);
};

module.exports.updateCommentService = function updateCommentService(id, commentDetails) {
  return updateCommentRepository(id, commentDetails);
};

module.exports.deleteCommentService = function deleteCommentService(id) {
  return deleteCommentRepository(id);
};
