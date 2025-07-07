import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../Config/api'

const initialState = {
  isLoading: false,
}


export const sendOtpThunk = createAsyncThunk(
  'auth/forgot-password/send-otp',
  async (email, { rejectWithValue }) => {
    try {

      const { data, status } = await api.post('/auth/forgot-password', email)

      return {
        data,
        status
      }
    } catch (error) {
      
      return rejectWithValue(error.response?.data || 'Error sending otp')
    }
  }
)

export const verifyOtpThunk = createAsyncThunk(
  'auth/forgot-password/reset-password',
  async ({otp, newPassword}, { rejectWithValue }) => {
    try {
      const { data, status } = await api.post(
        '/auth/reset-password',
       { otp,
        newPassword}
      )

      return {
        data,
        status
      }
    } catch (error) {
      
      return rejectWithValue(error.response?.data || 'Error verify otp')
    }
  }
)

export const resendOtpThunk = createAsyncThunk(
  'auth/email-resend-otp',
  async (email, { rejectWithValue }) => {
    try {
      

      const { data, status } = await api.post('/auth/email-resend-otp', email)

      return {
        data,
        status
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error resend otp')
    }
  }
)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      // Login

      .addCase(sendOtpThunk.pending, state => {
        state.isLoading = true
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(sendOtpThunk.rejected, state => {
        state.isLoading = false
      })

      .addCase(verifyOtpThunk.pending, state => {
        state.isLoading = true
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(verifyOtpThunk.rejected, state => {
        state.isLoading = false
      })

      .addCase(resendOtpThunk.pending, state => {
        state.isLoading = true
      })
      .addCase(resendOtpThunk.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(resendOtpThunk.rejected, state => {
        state.isLoading = false
      })
  }
})

export default authSlice.reducer
