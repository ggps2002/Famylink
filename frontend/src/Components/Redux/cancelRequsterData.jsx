import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/api";

// Define the initial state
const initialState = {
    isLoading: false,
    data: [],
    pagination: {
        currentPage: 1,
        totalPages: 0,
        pageSize: 0,
        totalRecords: 0,
    },
};

export const fetchCancelRequesterThunk = createAsyncThunk(
    "book-hire/fetchRequest",
    async ({ page, limit }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;
            const {data} = await api.get(`/book-hire/rejected-bookings-request/?limit=${limit}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                },
            });

            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const rejectedDataSlice = createSlice({
    name: "rejectedData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle pending state
            .addCase(fetchCancelRequesterThunk.pending, (state) => {
                state.isLoading = true;
            })
            // Handle fulfilled state
            .addCase(fetchCancelRequesterThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            // Handle rejected state
            .addCase(fetchCancelRequesterThunk.rejected, (state) => {
                state.isLoading = false;
            })
    },
});

export default rejectedDataSlice.reducer;
