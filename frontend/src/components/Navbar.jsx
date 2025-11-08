import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react'; 

const Navbar = ({ noteCount }) => { 
    const { isAuthenticated, logout, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar-container">
            <Link to="/" className="navbar-app-title">
                Note Application
            </Link>

            <div className="navbar-controls-group"> 
                <button
                    onClick={toggleTheme}
                    className={`theme-toggle-btn ${theme === 'dark' ? 'sun' : 'moon'}`}
                    aria-label="Toggle dark mode"
                >
                    {theme === 'light' ? (<Moon size={24} />) : (<Sun size={24} />)}
                </button>

                {isAuthenticated ? (
                    <>
                        {isAdmin && (
                            <Link to="/admin" className="navbar-admin-link">
                                Administrator Dashboard
                            </Link>
                        )}

                        <Link to="/" className="navbar-link">
                            Notes 
                            {noteCount !== undefined && (
                                <span className="note-count-badge">({noteCount})</span>
                            )}
                        </Link>
                        
                        <button 
                            onClick={logout} 
                            className="btn-logout">
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-link">Login</Link>
                        <Link to="/register" className="navbar-link" style={{marginRight: '0'}}>
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 