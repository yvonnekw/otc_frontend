import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listCalls } from '../services/CallService';
import { Call } from './types'; // Adjust the import path if needed

// Async thunk to fetch calls
export const fetchCalls = createAsyncThunk<Call[]>(
    'calls/fetchCalls',
    async () => {
        try {
            const calls = await listCalls();
            return calls; // Assuming listCalls returns Call[]
        } catch (error) {
            // Optionally handle or log the error here
            throw new Error('Failed to fetch calls');
        }
    }
);

const callsSlice = createSlice({
    name: 'calls',
    initialState: {
        calls: [] as Call[], // Initial state for calls
        status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null as string | null, // Initial error state
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCalls.pending, (state) => {
                state.status = 'loading'; // Set status to loading when fetch starts
            })
            .addCase(fetchCalls.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Set status to succeeded when fetch is complete
                state.calls = action.payload; // Populate state with fetched calls
            })
            .addCase(fetchCalls.rejected, (state, action) => {
                state.status = 'failed'; // Set status to failed if fetch fails
                state.error = action.error.message ?? 'Unknown error'; // Capture error message
            });
    },
});

// Export the reducer to be used in store configuration
export default callsSlice.reducer;

/*
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listCalls } from '../services/CallService';
import { Call } from './types'; // Adjust the import path if needed

// Async thunk to fetch calls
export const fetchCalls = createAsyncThunk(
    'calls/fetchCalls',
    async () => {
        try {
            const calls = await listCalls();
            return calls; // Assuming listCalls returns Call[]
        } catch (error) {
            throw new Error('Failed to fetch calls');
        }
    }
);

// Slice definition
const callsSlice = createSlice({
    name: 'calls',
    initialState: {
        calls: [] as Call[],
        status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCalls.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCalls.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.calls = action.payload;
            })
            .addCase(fetchCalls.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error';
            });
    },
});

// Export reducer
export default callsSlice.reducer;
*/
/*
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listCalls } from '../services/CallService';
import { Call } from './types'; // Import your Call interface

// Async thunk to fetch calls
export const fetchCalls = createAsyncThunk(
    'calls/fetchCalls',
    async () => {
        try {
            const response = await listCalls();
            return response.data; // Assuming listCalls returns { data: Call[] }
        } catch (error) {
            throw new Error('Failed to fetch calls');
        }
    }
);

// Slice definition
const callsSlice = createSlice({
    name: 'calls',
    initialState: {
        calls: [] as Call[],
        status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCalls.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCalls.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.calls = action.payload;
            })
            .addCase(fetchCalls.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error';
            });
    },
});

// Export reducer
export default callsSlice.reducer;

*/