import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Adjust the path as necessary
import userReducer from './userReducer'; // Adjust the path as necessary
import callsReducer from './callReducer'; // Assuming this handles 'calls' slice
import messageReducer from './messageReducer'; // Assuming this handles 'errorMessage' slice



const combinedReducer = combineReducers({
    user: userReducer,
    auth: authReducer,
    calls: callsReducer,
    errorMessage: messageReducer,

});

export default combinedReducer;
