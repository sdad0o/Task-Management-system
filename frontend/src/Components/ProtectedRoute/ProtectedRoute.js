import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ProtectedRoute({ component: Component, roleRequired, ...rest }) {
    const token = Cookies.get('authToken');
    const role = Cookies.get('role');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (role !== roleRequired) {
        return <Navigate to="/unAuth" />; 
    }

    return <Component {...rest} />; 
}

export default ProtectedRoute;
