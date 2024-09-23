import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listCalls } from '../services/CallService';
import { Call } from './types'; // Adjust the import path if needed

export const fetchCalls = createAsyncThunk<Call[]>(
    'calls/fetchCalls',
    async () => {
        try {
            const calls = await listCalls();
            return calls;
        } catch (error) {

            throw new Error('Failed to fetch calls');
        }
    }
);

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
                state.status = 'succeeded'; // Set status to succeeded when fetch is complete
                state.calls = action.payload; // Populate state with fetched calls
            })
            .addCase(fetchCalls.rejected, (state, action) => {
                state.status = 'failed'; // Set status to failed if fetch fails
                state.error = action.error.message ?? 'Unknown error'; // Capture error message
            });
    },
});


export default callsSlice.reducer;
