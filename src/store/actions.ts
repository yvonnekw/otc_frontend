// actions.ts

import {
    SET_CALLS,
    SET_ERROR_MESSAGE,
    SET_SUCCESS_MESSAGE,
    User,
    Call,
    ActionTypes,
    SET_USER,
} from './types';

export const setCalls = (calls: Call[]): ActionTypes => ({
    type: SET_CALLS,
    payload: calls,
});

export const setUser = (user: User): ActionTypes => ({
    type: SET_USER,
    payload: user
});


export const setErrorMessage = (message: string): ActionTypes => ({
    type: SET_ERROR_MESSAGE,
    payload: message,
});

export const setSuccessMessage = (message: string): ActionTypes => ({
    type: SET_SUCCESS_MESSAGE,
    payload: message,
});


/*

import { SET_USER, SET_CALLS, SET_ERROR_MESSAGE, SET_SUCCESS_MESSAGE, User, Call, ActionTypes } from './types';

// Action creators
export const setUser = (user: User): ActionTypes => ({
    type: SET_USER,
    payload: user
});

export const setCalls = (calls: Call[]): ActionTypes => ({
    type: SET_CALLS,
    payload: calls
});

export const setErrorMessage = (message: string): ActionTypes => ({
    type: SET_ERROR_MESSAGE,
    payload: message
});

export const setSuccessMessage = (message: string): ActionTypes => ({
    type: SET_SUCCESS_MESSAGE,
    payload: message
});


*/


