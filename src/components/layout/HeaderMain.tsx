import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Container} from '@mui/material';
import Logo from '../Logo';
import { FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';


const HeaderMain: React.FC = () => {
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    const logout = auth.handleLogout();
  }

  return (

    <header className='bg-header'  style={{ backgroundColor: 'white', paddingTop: '20px', paddingBottom: '20px' }}>
      <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
            <Logo w={100} h={50} />
          </Link>
        </div>
        <div className='flex items-center gap-7'>

          </div>
        </div>
    </header>

  );
};

export default HeaderMain;