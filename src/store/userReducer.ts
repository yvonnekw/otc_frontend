// reducer.ts
import { ActionTypes, SET_USER, SET_ERROR_MESSAGE } from './types';
import { AuthState } from './types'; // Import AuthState from types.ts


const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    errorMessage: '',
};

const userReducer = (state = initialState, action: ActionTypes): AuthState => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;

