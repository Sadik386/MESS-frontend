import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    // For now, if not authenticated (and not loading), redirect to login
    // Note: In real app, we need to wait for loadUser to finish.
    // Since we haven't implemented loadUser fully, we might have issues on refresh.
    // I'll rely on token presence in localStorage for initial state in AuthContext.

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
