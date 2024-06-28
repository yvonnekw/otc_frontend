// store.ts

import { configureStore } from '@reduxjs/toolkit';
import combinedReducer from './combinedReducer';
export type RootState = ReturnType<typeof combinedReducer>;

const store = configureStore({
    reducer: combinedReducer,

});

export default store;


// Store has all of the default middleware added, _plus_ the logger middleware


// store.ts

/*
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import reducer from './reducer'; // Ensure you export the root reducer from reducer.ts

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

*/


/*

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});




export default store;

*/
/*

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;

*/