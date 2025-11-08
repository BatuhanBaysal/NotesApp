import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext.jsx';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.xsrfCookieName = null;
axios.defaults.xsrfHeaderName = null;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider> 
                    <App />
                    <ToastContainer 
                        position="top-right" 
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored" 
                    />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
);