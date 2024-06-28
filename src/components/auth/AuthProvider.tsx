
import React, { createContext, ReactNode, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { RootState } from '../../store/store';
import { logout, loginSuccess, loginFailure } from '../../store/authSlice'; // Adjust the path as necessary

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


/*
import React, { createContext, ReactNode, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { RootState } from '../../store/store';
import { logout, login } from '../../store/authSlice'; // Adjust the path as necessary

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
        dispatch(login(user));
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

*/
/*

import React, { createContext, ReactNode, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout, login } from '../../store/authSlice'; // Adjust the path as necessary

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(login(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const isLoggedIn = () => auth.isAuthenticated;

  const handleLogout = () => {
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

*/

/*
import React, { createContext, ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout, login } from '../../store/authSlice'; // Adjust the path as necessary

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(login(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const isLoggedIn = () => auth.isAuthenticated;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role: auth.user?.role, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

*/
/*
import React, { createContext, ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout, login } from './authSlice'; // Adjust the path as necessary

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(login(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const isLoggedIn = () => auth.isAuthenticated;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role: auth.user?.role, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
*/


/*

import React, { ReactNode, createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";

interface User {
  sub: string;
  scope: string;
}

interface DecodedToken {
  sub: string;
  scope: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
  isLoggedIn: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  handleLogin: () => { },
  handleLogout: () => { },
  isLoggedIn: () => false,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");
    if (userId && userRole) {
      return { sub: userId, scope: userRole };
    }
    return null;
  });

  const [role, setRole] = useState<string | null>(() => localStorage.getItem("userRole"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwt_decode(token);
        if (Date.now() >= decodedToken.exp * 1000) {
          handleLogout();
        } else {
          setUser({ sub: decodedToken.sub, scope: decodedToken.scope });
          setRole(decodedToken.scope);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (token: string) => {
    try {
      const decodedToken: DecodedToken = jwt_decode(token);
      localStorage.setItem("userId", decodedToken.sub);
      localStorage.setItem("userRole", decodedToken.scope);
      localStorage.setItem("token", token);
      setUser({ sub: decodedToken.sub, scope: decodedToken.scope });
      setRole(decodedToken.scope);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    try {
      const decodedToken: DecodedToken = jwt_decode(token);
      return Date.now() < decodedToken.exp * 1000;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, handleLogin, handleLogout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

*/
/*
import React, { ReactNode, createContext, useState } from 'react';
import jwt_decode from "jwt-decode";

interface User {
  sub: string;
  scope: string;
}

interface DecodedToken {
  sub: string;
  scope: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  role: string | null; 
  handleLogin: (token: string) => void; 
  handleLogout: () => void;
  isLoggedIn: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null, 
  handleLogin: () => { },
  handleLogout: () => { },
  isLoggedIn: () => false,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); 

  const handleLogin = (token: string) => {
    try {
      const decodedToken: DecodedToken = jwt_decode(token);

        localStorage.setItem("userId", decodedToken.sub);
        localStorage.setItem("userRole", decodedToken.scope);
        localStorage.setItem("token", token);
        setUser(decodedToken);
        setRole(decodedToken.scope); 
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null); 
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    try {
      const decodedToken: DecodedToken = jwt_decode(token);
      const isExpired = Date.now() >= decodedToken.exp * 1000;
      return !isExpired;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, handleLogin, handleLogout, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

*/