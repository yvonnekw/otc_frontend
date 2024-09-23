import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    username?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    role: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user?: User | null;
    errorMessage: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    errorMessage: null,
};

const saveUserToLocalStorage = (user: User) => localStorage.setItem('user', JSON.stringify(user));
const removeUserFromLocalStorage = () => localStorage.removeItem('user');

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.errorMessage = null;
            saveUserToLocalStorage(action.payload);
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = false;
            state.user = null;
            state.errorMessage = action.payload;
            removeUserFromLocalStorage();
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.errorMessage = null;
            removeUserFromLocalStorage();
        },
    },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
