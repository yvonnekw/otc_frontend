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

    const allowedRoutes = ['/dashboard', '/user-calls', '/profile', '/make-call', '/payment', '/user-calls/Invoiced', '/user-calls/Paid', '/get-all-users', '/add-new-receiver'];

    if (allowedRoutes.includes(location.pathname)) {
      
        return <>{children}</>;
    }
    return <Unauthorized />;
};

export default RequireAuth;

