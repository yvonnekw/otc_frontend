import { ActionTypes, Call, SET_CALLS, SET_ERROR_MESSAGE, SET_SUCCESS_MESSAGE } from './types';

interface State {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    calls: Call[];
    errorMessage: string;
    successMessage: string;
}


const initialState: State = {
    calls: [],
    errorMessage: '',
    successMessage: '',
    status: "idle",
    error: null
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

