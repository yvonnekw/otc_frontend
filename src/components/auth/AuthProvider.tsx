
import React, { createContext, ReactNode, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { RootState } from '../../store/store';
import { logout, loginSuccess } from '../../store/authSlice'; // Adjust the path as necessary

interface AuthContextType {
  isLoggedIn: () => boolean;
  role: string | undefined;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const user = {
          username: decodedToken.username,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          emailAddress: decodedToken.emailAddress,
          role: decodedToken.roles,
        };
        dispatch(loginSuccess(user));
      } catch (error) {
        console.error('Error decoding token:', error);
        dispatch(logout());
      }
    }
  }, [dispatch]);

  const isLoggedIn = () => !!auth.user;

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role: auth.user?.role, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
