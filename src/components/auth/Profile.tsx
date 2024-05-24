import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import  { AuthContext } from './AuthProvider';


interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: { telephone: string }[];
  status: string;
}


const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const location = useLocation();
  const message = location.state && location.state.message;

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        try {
          const userData: User = await getUser(userId!, token!);
          setUser(userData);
          setCurrentUser(localStorage.getItem("userId"));
        } catch (error) {
          console.error("Error fetching user details: ", error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response: Call[] = await getCallsByUsername(userId!);
        setCalls(response);
      } catch (error) {
        console.error("Error fetching calls: ", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchCalls();
  }, [userId, token]);

  return (
    <div className='container mb-3'>
      {currentUser && <h6 className='text-success text-center'>You are logged in as: {currentUser}</h6>}
      {user && (
        <div className='card p-5 mt-5' style={{ backgroundColor: "whitesmoke" }}>
          <h4 className='card-title text-center'>User Information</h4>
          <div className='card-body'>
            <div className='col-md-10 mx-auto'>
              <div className='card mb-3 shadow'>
                <div className='row g-0'>
                  <div className='col-md-2'></div>
                  <div className='col-md-10'>
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Username</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.username}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>First Name</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.firstName}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Last Name</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.lastName}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Email Address</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.emailAddress}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Phone number</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.telephone}</p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h4 className='card-title text-center'>Call History</h4>
          {calls.length > 0 ? (
            <table className="table table-bordered table-hover shadow">
              <thead>
                <tr>
                  <th scope="col">Call ID</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  <th scope="col">Receiver Telephone</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {calls.map(call => (
                  <tr key={call.id}>
                    <td>{call.callId}</td>
                    <td>{call.startTime}</td>
                    <td>{call.endTime}</td>
                    <td>{Array.isArray(call.receiver) ? call.receiver.map(receiver => (receiver as { telephone: string }).telephone).join(', ') : (call.receiver as { telephone: string }).telephone}</td>
                    <td>{call.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No calls found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

