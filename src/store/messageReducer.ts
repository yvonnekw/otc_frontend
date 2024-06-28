// reducer.ts
import { ActionTypes, SET_ERROR_MESSAGE, SET_SUCCESS_MESSAGE } from './types';
import { MessageState } from './types';

const initialState: MessageState = {
    errorMessage: '',
};

const messageReducer = (state = initialState, action: ActionTypes): MessageState => {
    switch (action.type) {
        case SET_SUCCESS_MESSAGE:
            return {
                ...state,
                successMessage: action.payload,
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

export default messageReducer;



