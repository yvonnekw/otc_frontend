import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Unauthorized from './Unauthorized';

interface RequireAuthProps {
    children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const user = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    const location = useLocation();


    if (!user || !role) {
   
        return <Navigate to="/login" state={{ path: location.pathname }} />;
    }

    if (role === 'ADMIN') {
     
        return <>{children}</>;
    }

    const allowedRoutes = ['/dashboard', '/profile', '/make-call', '/payment', '/user-calls/invoiced', '/user-calls/paid', '/get-all-users', '/add-new-receiver'];

    if (allowedRoutes.includes(location.pathname)) {
      
        return <>{children}</>;
    }
    return <Unauthorized />;
};

export default RequireAuth;

