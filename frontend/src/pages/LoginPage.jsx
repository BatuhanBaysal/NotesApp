import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); 

        try {
            await login(username, password);
            navigate('/'); 
        } catch (err) {
            setError("Login failed. Please check your username or password.");
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-form-card">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
                    
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign in'}
                    </button>
                </form>
                <p>Don't you have an account? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;