let chatUsers = [];

function addChatUser(user) {
  const exists = chatUsers.find(u => u.id === user.id);
  if (!exists) {
    chatUsers.push(user);
  }
}

function removeChatUserById(id) {
  const user = chatUsers.find(u => u.id === id);
  chatUsers = chatUsers.filter(u => u.id !== id);
  return user;
}

function getChatUsers() {
  return chatUsers;
}

export default {
  addChatUser,
  removeChatUserById,
  getChatUsers,
};
