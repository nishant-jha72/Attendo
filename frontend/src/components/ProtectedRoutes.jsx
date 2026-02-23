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

    // Role-Based Access Control (RBAC)
    if (allowedRole && userRole !== allowedRole) {
        // Redirect to their respective dashboard if they try to cross over
        const fallbackPath = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
        return <Navigate to={fallbackPath} replace />;
    }

    return children;
};

export default ProtectedRoute;