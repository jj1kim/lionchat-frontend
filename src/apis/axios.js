import axios from 'axios';

// baseURL, credential, 헤더 세팅
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 누구나 접근 가능한 API들
export const instance = axios.create();

// Token 있어야 접근 가능한 API들 — 인터셉터로 토큰 첨부
export const instanceWithToken = axios.create();
instanceWithToken.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log('Request Error!!');
    return Promise.reject(error);
  }
);

instanceWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    // 토큰이 만료되었거나 무효해진 경우 — 캐시 정리 후 로그인으로
    if (error.response?.status === 401) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
