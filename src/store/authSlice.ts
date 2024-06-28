import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    role: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    errorMessage: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    errorMessage: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.errorMessage = null; // Reset error message on successful login
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = false;
            state.user = null;
            state.errorMessage = action.payload;
            localStorage.removeItem('user');
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.errorMessage = null;
            localStorage.removeItem('user');
        },
    },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;



/*

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JSX, ReactNode } from 'react';

interface User {

    lastName: ReactNode;
    emailAddress: ReactNode;
    //userId: string;
    username: string;
    firstName: string;
    //lastName: string;
    //emailAddress: string;
    role: string;
}

interface AuthState {
    username: ReactNode;
    firstName: ReactNode;
    lastName: ReactNode;
    emailAddress: ReactNode;
    telephone: ReactNode;
    role: ReactNode;
    errorMessage: ReactNode;
    length: number;
    map(arg0: (call: any) => import("react").JSX.Element): import("react").ReactNode;
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    length: 0,
    map: function (arg0: (call: any) => JSX.Element): ReactNode {
        throw new Error('Function not implemented.');
    },
    errorMessage: undefined,
    username: undefined,
    firstName: undefined,
    lastName: undefined,
    emailAddress: undefined,
    telephone: undefined,
    role: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            console.log("action payload user ", state.user)
            console.log("action payload payload", action.payload)
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;


*/


