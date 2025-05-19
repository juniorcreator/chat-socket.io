const users = [
  { name: 'serhii', email: '1', password: '1' },
  { name: 'luda', email: '2', password: '2' },
  { name: 'karina', email: '3', password: '3' },
];

function addUser({ name, email, password }) {
  users.push({ name, email, password });
}

function findUser(email, password) {
  return users.find(user => user.email === email && user.password === password);
}

function exists(email) {
  return users.some(user => user.email === email);
}

function getAllUsers() {
  return users.map(({ name, email }) => ({ name, email })); // без паролей
}

export default {
  addUser,
  findUser,
  exists,
  getAllUsers,
};
