import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage'; 
import AdminRoute from './routes/AdminRoute';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth(); 

    if (isLoading) {
        return <div className="loading-message">Authenticating...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    const [totalNoteCount, setTotalNoteCount] = useState(0);

    return (
        <div className="min-h-screen"> 
            <Navbar noteCount={totalNoteCount} /> 
            
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
 
                <Route 
                    path="/" 
                    element={
                        <PrivateRoute>
                            <HomePage setTotalNoteCount={setTotalNoteCount} /> 
                        </PrivateRoute>
                    } 
                />
                    
                <Route 
                    path="/admin" 
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    } 
                />
            </Routes>
        </div>
    );
}

export default App;