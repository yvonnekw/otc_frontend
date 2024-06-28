import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listCalls } from '../services/CallService';
import { RootState } from './store'; // Adjust path as needed
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

