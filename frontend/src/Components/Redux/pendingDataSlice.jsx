import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/api";

const initialState = {
    isLoading: false,
    data: [], // To store the list of pending requests
    pagination: {
        currentPage: 1,
        totalPages: 0,
        pageSize: 0,
        totalRecords: 0,
    },
    error: null, // To store error messages
};

export const pendingDataThunk = createAsyncThunk(
    "book-hire/pendingData",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;
            const response = await api.get(`/book-hire/pending/?limit=${limit}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                },
            });
            return response.data; // Ensure this contains the correct structure
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const pendingSlice = createSlice({
    name: "pending",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(pendingDataThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Reset error on new request
            })
            .addCase(pendingDataThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data; // Assuming 'data' contains the pending requests
                state.pagination = {
                    currentPage: action.payload.pagination.currentPage,
                    totalPages: action.payload.pagination.totalPages,
                    pageSize: action.payload.pagination.limit, // Ensure this exists in the response
                    totalRecords: action.payload.pagination.totalRecords,
                };
            })
            .addCase(pendingDataThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Store the error message
            });
    },
});

// Export the reducer
export default pendingSlice.reducer;