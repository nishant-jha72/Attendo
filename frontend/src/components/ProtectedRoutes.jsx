import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    const location = useLocation();
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole'); // 'admin' or 'user'

    if (!isLoggedIn) {
        // Redirect to specific login based on the intended role
        const loginPath = allowedRole === 'admin' ? '/admin-auth?mode=login' : '/user-auth';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (allowedRole && userRole !== allowedRole) {
        // If an employee tries to access /admin-dashboard, send them home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;