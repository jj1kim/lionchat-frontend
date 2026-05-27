import { instance, instanceWithToken } from './axios.js';

export const auth = {
  signup: (data) => instance.post('/auth/signup/', data),
  login: (data) => instance.post('/auth/login/', data),
};

export const users = {
  me: () => instanceWithToken.get('/users/me/'),
};

export const chats = {
  send: (prompt) => instanceWithToken.post('/chat/', { prompt }),
  list: () => instanceWithToken.get('/chats/'),
  detail: (id) => instanceWithToken.get(`/chats/${id}/`),
};
