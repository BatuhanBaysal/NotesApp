import axios from 'axios';

const ADMIN_API_URL = 'http://localhost:8080/api/admin'; 

const AdminApiService = {
    getAllUsers: (token) => {
        return axios.get(`${ADMIN_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    updateUserRole: (userId, newRole, token) => {
        return axios.put(`${ADMIN_API_URL}/users/${userId}/role`, { 
            role: newRole 
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    deleteUser: (userId, token) => {
        return axios.delete(`${ADMIN_API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};

export default AdminApiService;