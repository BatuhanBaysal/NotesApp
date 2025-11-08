import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080/api/notes';

export const axiosInstance = axios.create({ 
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken'); 
    
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { status } = error.response || {};
        const isNetworkError = !error.response; 

        if (status === 401 || status === 403) {
            localStorage.removeItem('jwtToken');
            toast.error("Session expired or unauthorized. Redirecting to login.");
            setTimeout(() => {
                 window.location.href = '/login'; 
            }, 1000); 
            
        } else if (status) {
            let message = error.response.data?.message || `Server Error: Status ${status}`;
            toast.error(`Operation Failed: ${message}`);

        } else if (isNetworkError) {
            toast.error("Network Error: Could not connect to the API server.");
        }
        
        return Promise.reject(error);
    }
);

const NoteApiService = {
    getAllNotes: () => {
        return axiosInstance.get('/all') 
    },

    createNote: async (noteData) => {
        try {
            const response = await axiosInstance.post('/create', noteData);
            toast.success("Note created successfully!"); 
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateNote: async (id, noteData) => {
        try {
            const response = await axiosInstance.put(`/update/${id}`, noteData);
            return response; 
        } catch (error) {
            throw error;
        }
    },

    deleteNote: async (id) => {
        try {
            const response = await axiosInstance.delete(`/deleteId/${id}`);
            toast.warn("Note deleted.");
            return response;
        } catch (error) {
            throw error;
        }
    },

    getNoteById: (id) => {
        return axiosInstance.get(`/${id}`);
    }
};

export default NoteApiService;