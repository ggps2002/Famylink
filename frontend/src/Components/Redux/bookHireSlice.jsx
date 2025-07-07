import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/api";

const initialState = {
    isLoading: false,
    status: [],
};

export const requestThunk = createAsyncThunk(
    "book-hire/request",
    async (jobId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.post("/book-hire/request",
                { jobId }, // Ensure this matches your backend
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                    },
                }
            );
            return { data, status }; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response.data); // Handle error
        }
    }
);

export const statusThunk = createAsyncThunk(
  "book-hire/status",
  async (input, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { accessToken } = state.auth;

      // input could be a string (jobId) or object (with nannyId or jobId)
      let params = new URLSearchParams();
      if (typeof input === "string") {
        params.append("jobId", input);
      } else if (typeof input === "object") {
        if (input.jobId) params.append("jobId", input.jobId);
        if (input.nannyId) params.append("nannyId", input.nannyId);
      }

      const { data, status } = await api.get(`/book-hire/status?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return { data, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


export const withDrawThunk = createAsyncThunk(
    "book-hire/withDraw",
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.put(`/book-hire/withdraw/${bookingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                    },
                }
            );
            return { data, status }; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response.data); // Handle error
        }
    }
);
export const reconsiderThunk = createAsyncThunk(
    "book-hire/reconsider",
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.put(`/book-hire/reconsider-booking/${bookingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                    },
                }
            );
            return { data, status }; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response.data); // Handle error
        }
    }
);

export const rejectedReqThunk = createAsyncThunk(
    "book-hire/reject-request",
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.put(`/book-hire/reject-request/${bookingId}`,
                {}, // Empty object for the request body
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                    },
                }
            );
            return { data, status }; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response.data); // Handle error
        }
    }
);

export const acceptReqThunk = createAsyncThunk(
    "book-hire/accept-request",
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.put(
                `/book-hire/accept-request/${bookingId}`,
                {}, // Empty object for the request body
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

export const cancelBookingThunk = createAsyncThunk(
    "book-hire/cancel-booking",
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.put(`/book-hire/cancel-booking/${bookingId}`,
                {}, // Empty object for the request body
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send the token for authentication
                    },
                }
            );
            return { data, status }; // Return the response data
        } catch (error) {
            return rejectWithValue(error.response.data); // Handle error
        }
    }
);

export const completeReqThunk = createAsyncThunk(
    "book-hire/complete-request",
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth; // Get access token from state

            const { data, status } = await api.put(
                `/book-hire/complete-booking/${bookingId}`,
                {}, // Empty object for the request body
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

const bookHireSlice = createSlice({
    name: "bookHire",
    initialState,
    reducers: {
        updateStatus: (state, action) => {
            state.status = action.payload; // Update status with new data
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(requestThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(requestThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(requestThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

            .addCase(statusThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(statusThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload.data.bookings;
            })
            .addCase(statusThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

            .addCase(withDrawThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(withDrawThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(withDrawThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

            .addCase(rejectedReqThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(rejectedReqThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(rejectedReqThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

            .addCase(acceptReqThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(acceptReqThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(acceptReqThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

            .addCase(cancelBookingThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(cancelBookingThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(cancelBookingThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

            .addCase(completeReqThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(completeReqThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(completeReqThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

            .addCase(reconsiderThunk.pending, (state) => {
                state.isLoading = true; // Set loading state
            })
            .addCase(reconsiderThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(reconsiderThunk.rejected, (state) => {
                state.isLoading = false; // Reset loading state on error
            })

    }
})

export const { updateStatus } = bookHireSlice.actions;
export default bookHireSlice.reducer;