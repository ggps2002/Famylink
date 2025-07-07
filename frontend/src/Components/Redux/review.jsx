import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Config/api";// Replace with your API service setup

export const submitReviewThunk = createAsyncThunk(
    "reviews/submitReview",
    async ({ bookingId, rating, msg, userType }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.post(
                `/reviews`, // Your API endpoint for submitting reviews
                { bookingId, rating, msg, userType }, // Review data payload
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                    },
                }
            );

            return { data, status }; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message); // Handle error
        }
    }
);

export const getReviewThunk = createAsyncThunk(
    "review/getById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/reviews/${id}`);
            return data; // Assuming message contains the nanny details
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const reviewsSlice = createSlice({
    name: "reviews",
    initialState: {
        isLoading: false,
        reviews: {}, // Store reviews
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitReviewThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(submitReviewThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(submitReviewThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to submit review";
            })

            .addCase(getReviewThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviewThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload.data // Assuming the review has an id
            })
            .addCase(getReviewThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch review";
            });
    },
});

export default reviewsSlice.reducer;