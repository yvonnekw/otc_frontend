
import React, { useState, useContext} from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logout from "../auth/Logout"
import { AuthContext } from '../auth/AuthProvider'


const NavBar = () => {
  const [showAccount, setShowAccount] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext);
  const { role } = useContext(AuthContext);

  const userId = localStorage.getItem("userId") ?? '';

  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };

  const userRole = user ? user.scope : null;

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary px-5 shadow mt-5 sticky-top'>
      <div className='container-fluid'>
        <Link to={"/"}>
          <span className='navbar-brand'>Optical Telephone Company</span>
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbar-scroll'
          aria-controls='#navbar-scroll'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toogler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarScroll'>
          <ul className='navbar-nav me-auto my-2 my-lg-0 navbar-scroll'>
            {isLoggedIn() && role === "ADMIN" && (
              <li className='nav-item'>
                <NavLink className='nav-link' aria-current='page' to={'/admin'}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <ul className='d-flex navbar-nav'>
            <li className='nav-item dropdown'>
              <a
                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                href='#'
                role='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                onClick={handleAccountClick}>
                {" "}
                Account
                {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
              </a>
              <ul
                className={`dropdown-menu ${showAccount ? "show" : ""}`}
                id="navbarDropdown" aria-labelledby="navbarDropdown">
                <li>
                  <Link className='dropdown-item' to="/payment" >
                    Pay for calls
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to="/user-calls/Paid" >
                    Paid Calls
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to="/user-calls/Invoiced" >
                    Invoiced Calls
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to="/add-new-receiver" >
                    Add A New Call Receiver
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to={'/make-call'} >
                    Make A Call
                  </Link>
                </li>
                {isLoggedIn() ? (
                  <Logout />
                ) : (
                  <li>
                    <Link className='dropdown-item' to={'/login'} >
                      Login
                    </Link>
                  </li>

                )}

              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
