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

export const fetchWithdrawRequesterThunk = createAsyncThunk(
    "book-hire/fetchRequest",
    async ({ page, limit }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;
            const {data} = await api.get(`/book-hire/get-withdraw-requests/?limit=${limit}&page=${page}`, {
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

const withdrawDataSlice = createSlice({
    name: "withdrawData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle pending state
            .addCase(fetchWithdrawRequesterThunk.pending, (state) => {
                state.isLoading = true;
            })
            // Handle fulfilled state
            .addCase(fetchWithdrawRequesterThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            // Handle rejected state
            .addCase(fetchWithdrawRequesterThunk.rejected, (state) => {
                state.isLoading = false;
            })
    },
});

export default withdrawDataSlice.reducer;