import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const message = location.state && location.state.message;
  const currentUser = localStorage.getItem("userId");

  return (
    <section>
      {message && <p className='text-warning px-5'>{message}</p>}
      {currentUser && <h6 className='text-success text-center'>You are logged in as: {currentUser}</h6>}
      <div className="container mt-5">
        <h1 className="mb-4" >Welcome to Optical Telephone Company</h1>
        <p className="lead">
          Optical Telephone Company platform where you can initiate and manage calls easily.
        </p>
        <div className="my-4">
          <h2>Get Started</h2>
          <p>New to Your App Name? Register now to get started!</p>
          <Link to="/register" className="mb-2 md-mb-0">Register</Link>
        </div>

        <div className="my-4">
          <h2>Already have an account?</h2>
          <p>Log in to access your dashboard and initiate calls.</p>
          <Link to="/login" className="mb-2 md-mb-0">Login</Link>
        </div>
      </div>
    </section>
  );
};

export default Home;

