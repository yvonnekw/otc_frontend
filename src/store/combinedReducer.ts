import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userReducer';
import callsReducer from './callReducer';
import messageReducer from './messageReducer';



const combinedReducer = combineReducers({
    user: userReducer,
    auth: authReducer,
    calls: callsReducer,
    errorMessage: messageReducer,

});

export default combinedReducer;
