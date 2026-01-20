import axios from 'axios';

async function getUserInfo() {
  const request = await axios.get('/api/users/me');
  return request.data;
}

async function login(username, password) {
  const request = await axios.post('/api/login', {
    username, password
  });
  return request.data;
}

async function logout() {
  const request = await axios.post('/api/logout');
  return request;
}

async function createAccount(username, password) {
  const request = await axios.post('/api/users', {
    username, password
  });
  return request.data;
}

export default { getUserInfo, login, logout, createAccount };
