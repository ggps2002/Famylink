import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/api";

const initialState = {
    isLoading: false
};

export const updateEmailThunk = createAsyncThunk(
    "update/email",
    async ({ currentEmail, newEmail }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const { data, status } = await api.put("/update/email", { currentEmail, newEmail }, config);

            return { data, status };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating email");
        }
    }
);

export const updatePasswordThunk = createAsyncThunk(
    "update/password",
    async ({ currentPassword, newPassword }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const { data, status } = await api.put("/update/password", { currentPassword, newPassword }, config);

            return { data, status };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating password");
        }
    }
);

export const updatePhoneThunk = createAsyncThunk(
    "update/phone",
    async ({ phoneNo }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const { data, status } = await api.put("/update/phone", { phoneNo }, config);

            return { data, status };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating phone number");
        }
    }
);

export const updateEmailNotiThunk = createAsyncThunk(
    "update/email-notifications",
    async ({ emailNotification }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const { accessToken } = state.auth;

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const { data, status } = await api.put("/update/email-notifications", { notifications: emailNotification }, config);

            return { data, status };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating email-notifications");
        }
    }
);

const updateSlice = createSlice({
    name: "update",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(updateEmailThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateEmailThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateEmailThunk.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(updatePasswordThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePasswordThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updatePasswordThunk.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(updatePhoneThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePhoneThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updatePhoneThunk.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(updateEmailNotiThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateEmailNotiThunk.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateEmailNotiThunk.rejected, (state) => {
                state.isLoading = false;
            })
    },
});

export default updateSlice.reducer;