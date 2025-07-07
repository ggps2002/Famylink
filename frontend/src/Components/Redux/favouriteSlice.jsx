import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/api";

// Define the initial state
const initialState = {
    isLoading: false,
    data: [], // To store the list of favorites
    pagination: {
        currentPage: 1,
        totalPages: 0,
        pageSize: 0,
        totalRecords: 0,
    },
};

// Thunk to fetch all nannies with pagination

export const fetchFavoritesThunk = createAsyncThunk(
    "favourite/fetchFavorites",
    async ({ page, limit }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;
            const {data} = await api.get(`/favourite/getData/?limit=${limit}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                },
            });

            return data; // Assuming the response contains data with favorites and pagination info
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addOrRemoveFavouriteThunk = createAsyncThunk(
    "favourite/addOrRemoveFavourite",
    async ({ favouriteUserId }, { getState, rejectWithValue }) => { // Log it here
        try {
            const state = getState();
            const { accessToken } = state.auth; 
            const { data } = await api.post(
                `/favourite/add`, // Your API endpoint
                { favouriteUserId }, // Ensure this matches your backend
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                    },
                }
            );

            return data; // Return the response data from the API
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



// Create the slice
const favouriteSlice = createSlice({
    name: "favourite",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle pending state for adding/removing a favourite
            .addCase(addOrRemoveFavouriteThunk.pending, (state) => {
                state.isLoading = true;
            })
            // Handle fulfilled state for adding/removing a favourite
            .addCase(addOrRemoveFavouriteThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            // Handle rejected state for adding/removing a favourite
            .addCase(addOrRemoveFavouriteThunk.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(fetchFavoritesThunk.pending, (state) => {
                state.isLoading = true;
            })
            // Handle fulfilled state for fetching favorites
            .addCase(fetchFavoritesThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data; // Assuming 'message' contains the favorites
                state.pagination = {
                    currentPage: action.payload.pagination.currentPage,
                    totalPages: action.payload.pagination.totalPages,
                    pageSize: action.payload.pagination.limit,
                    totalRecords: action.payload.pagination.totalRecords,
                };
            })
            // Handle rejected state for fetching favorites
            .addCase(fetchFavoritesThunk.rejected, (state) => {
                state.isLoading = false;
            })
    },
});

// Export the reducer
export default favouriteSlice.reducer;
