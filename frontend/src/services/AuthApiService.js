import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/api/auth'; 

const AuthApiService = {
    login: (username, password) => {
        return axios.post(`${AUTH_API_URL}/login`, { username, password });
    },
    register: (username, password) => {
        return axios.post(`${AUTH_API_URL}/register`, { username, password });
    }
};

export default AuthApiService;