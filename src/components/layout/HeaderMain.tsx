import React from 'react';
import { AppBar, Toolbar, Typography, Container} from '@mui/material';
import Logo from '../Logo';
import { FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const HeaderMain: React.FC = () => {
  return (

    <header className='h-16 shadow-md bg-white'>
      <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
            <Logo w={100} h={50} />
          </Link>
        </div>
        <div className='hidden lg:flex item-center w-full justify-between max-w-sm'>
          <input type='text' placeholder='search any calls here...' className='w-full outline-none pl-2' />
          <div className='text-lg min-w-[50px] h-8 rounded-full bg-blue-500 flex items-center justify-center'>
            <FiSearch />
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <div className='text-3xl cursor-pointer'>
            <FaUserCircle />
            </div>
          <div>
            
              <Link to={"/login"}  className='px-3 py-1 rounded-full text-white w-15 h-10 bg-blue-500 hover:bg-blue-600'>Login</Link>
            
          </div>
          </div>
        </div>
    </header>

  );
};

export default HeaderMain;