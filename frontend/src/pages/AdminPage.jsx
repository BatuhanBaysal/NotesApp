import React, { useEffect, useState, useCallback } from 'react';
import AdminApiService from "../services/AdminApiService"; 
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify"; 

const AdminPage = () => {
    const { user, token } = useAuth(); 
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filterRole, setFilterRole] = useState('all'); 

    const fetchUsers = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await AdminApiService.getAllUsers(token); 
            setUsers(response.data); 
            setError(null);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("There was an error loading the user list. Check your AdminApiService functions.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change user ${userId}'s role to ${newRole}?`)) {
            return;
        }
        
        if (user && userId === user.id) {
            toast.error("You cannot change your own role.");
            return;
        }

        try {
            await AdminApiService.updateUserRole(userId, newRole, token);
            toast.success(`User ${userId}'s role updated to ${newRole}`);
            fetchUsers(); 
        } catch (e) {
            toast.error("Role update failed! Service error.");
            console.error(e);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
            return;
        }

        if (user && userId === user.id) {
            toast.error("You cannot delete your own account while logged in.");
            return;
        }

        try {
            await AdminApiService.deleteUser(userId, token);
            toast.success(`User ${userId} deleted successfully.`);
            fetchUsers(); 
        } catch (e) {
            toast.error("User deletion failed! Service error.");
            console.error(e);
        }
    };

    const filteredUsers = users.filter(userItem => {
        const matchesSearch = userItem.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || userItem.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading || !user) return <div className="loading-message">Users are loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="admin-page-container">
            <h2>User Management Panel</h2>
            <p>Only administrators can view this page. Total Users: {users.length}</p>

            <div className="admin-controls">
                <input
                    type="text"
                    placeholder="Search users by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <label className="control-group">
                    Filter Role:
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                        <option value="all">All Roles</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                    </select>
                </label>
            </div>
            
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th> 
                        <th>Username</th>
                        <th>Role</th>
                        <th className="action-column">Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((userItem) => (
                        <tr key={userItem.id}> 
                            <td>{userItem.id}</td> 
                            <td>{userItem.username}</td>
                            <td>
                                <select 
                                    value={userItem.role} 
                                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                                    disabled={user && userItem.id === user.id} 
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                            <td className="action-column">
                                <button 
                                    className="btn-delete" 
                                    onClick={() => handleDeleteUser(userItem.id)}
                                    disabled={user && userItem.id === user.id} 
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;