export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

interface LoginAction {
    type: typeof LOGIN;
    payload: User;
}

interface LogoutAction {
    type: typeof LOGOUT;
}

export type AuthActionTypes = LoginAction | LogoutAction;
