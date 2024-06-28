// reducers.ts

import { ActionTypes, Call, SET_CALLS, SET_ERROR_MESSAGE, SET_SUCCESS_MESSAGE } from './types';

interface State {
    status: any;
    error: any;
    calls: Call[];
    errorMessage: string;
    successMessage: string;
}

const initialState: State = {
    calls: [],
    errorMessage: '',
    successMessage: '',
    status: undefined,
    error: undefined
};

const callsReducer = (state = initialState, action: ActionTypes): State => {
    switch (action.type) {
        case SET_CALLS:
            return {
                ...state,
                calls: action.payload,
            };
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: action.payload,
            };
        case SET_SUCCESS_MESSAGE:
            return {
                ...state,
                successMessage: action.payload,
            };
        default:
            return state;
    }
};

export default callsReducer;


/*
import { ActionTypes, SET_CALLS } from './types';
import { CallsState } from './types';

const initialState: CallsState = {
    calls: [],
};

const callsReducer = (state = initialState, action: ActionTypes): CallsState => {
    switch (action.type) {
        case SET_CALLS:
            return {
                ...state,
                calls: action.payload,
            };
        default:
            return state;
    }
};

export default callsReducer;

*/
