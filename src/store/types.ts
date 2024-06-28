import { ReactNode } from "react";

// Action Constants
export const SET_USER = 'SET_USER';
export const SET_CALLS = 'SET_CALLS';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';

// User Type
export interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    telephone: string;
    role: string;
}

// Call Type
export interface Call {
    id: string; // Assuming id is string based on usage
    callId: string; // Assuming callId is string based on usage
    callDate: string | number | Date;
    duration: ReactNode;
    costPerSecond: ReactNode;
    discountForCalls: ReactNode;
    vat: ReactNode;
    grossCost: ReactNode;
    netCost: ReactNode;
    user: User;
    startTime: string;
    endTime: string;
    receiver: Receiver[];
    status: string;
}

// Receiver Type
export interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

// Auth State Type
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    errorMessage: string;
}

// Calls State Type
export interface CallsState {
    calls: Call[];
}

// Message State Type
export interface MessageState {
    successMessage?: string;
    errorMessage: string;
}

// Action Types
export type ActionTypes =
    | SetUserAction
    | SetCallsAction
    | SetErrorMessageAction
    | SetSuccessMessageAction;

// Action Interfaces
interface SetUserAction {
    type: typeof SET_USER;
    payload: User;
}

interface SetCallsAction {
    type: typeof SET_CALLS;
    payload: Call[];
}

interface SetErrorMessageAction {
    type: typeof SET_ERROR_MESSAGE;
    payload: string;
}

interface SetSuccessMessageAction {
    type: typeof SET_SUCCESS_MESSAGE;
    payload: string;
}


/*
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export const SET_USER = 'SET_USER';
export const SET_CALLS = 'SET_CALLS';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';

export interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    telephone: string
    role: string;
}

export interface Call {
    callDate: string | number | Date;
    duration: ReactNode;
    costPerSecond: ReactNode;
    discountForCalls: ReactNode;
    vat: ReactNode;
    grossCost: ReactNode;
    netCost: ReactNode;
    user: any;
    id: string;
    callId: string;
    startTime: string;
    endTime: string;
    receiver: Receiver[];
    status: string;
}

export interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    errorMessage: string;
}

export interface CallsState {
    calls: Call[];
}

export interface MessageState {
    successMessage?: string;
    errorMessage: string;
}

export type ActionTypes =
    | SetUserAction
    | SetCallsAction
    | SetErrorMessageAction
    | SetSuccessMessageAction;

interface SetUserAction {
    type: typeof SET_USER;
    payload: User;
}

interface SetCallsAction {
    type: typeof SET_CALLS;
    payload: Call[];
}

interface SetErrorMessageAction {
    type: typeof SET_ERROR_MESSAGE;
    payload: string;
}

interface SetSuccessMessageAction {
    type: typeof SET_SUCCESS_MESSAGE;
    payload: string;
}

*/
/*
// types.ts
export const SET_USER = 'SET_USER';
export const SET_CALLS = 'SET_CALLS';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_SUCCESS_MESSAGE = 'SET_ERROR_MESSAGE';

export interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    role: string;
}

export interface Call {
    id: string;
    callId: string;
    startTime: string;
    endTime: string;
    receiver: Receiver[];
    status: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

export interface State {
    user: User | null;
    errorMessage: string;
}

export interface State {
    errorMessage: string;
}


export interface State {
    calls: Call[];
}


interface SetUserAction {
    type: typeof SET_USER;
    payload: User;
}

interface SetCallsAction {
    type: typeof SET_CALLS;
    payload: Call[];
}

interface SetErrorMessageAction {
    type: typeof SET_ERROR_MESSAGE;
    payload: string;
}

export type ActionTypes = SetUserAction | SetCallsAction | SetErrorMessageAction;

*/


/*
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
*/