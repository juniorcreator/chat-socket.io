const activeUsers = new Set();

export default {
  add(email) {
    activeUsers.add(email);
  },
  remove(email) {
    activeUsers.delete(email);
  },
  isActive(email) {
    return activeUsers.has(email);
  },
  getAll() {
    return Array.from(activeUsers);
  }
};
