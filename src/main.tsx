
import React, { useEffect } from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { User, getUser } from './services/UserService';

function app() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        try {
          const userData: User = await getUser(userId!);
          setUser(userData);
          setCurrentUser(localStorage.getItem('userId'));
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn, userId, token]);
  
}

createRoot(document.getElementById('root') as HTMLElement).render(



  <>
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    </BrowserRouter>
    
  </>
);

function setErrorMessage(message: any) {
  throw new Error('Function not implemented.');
}

function isLoggedIn() {
  throw new Error('Function not implemented.');
}

function setCurrentUser(arg0: string | null) {
  throw new Error('Function not implemented.');
}

