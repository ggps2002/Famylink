import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../Config/api'

const initialState = {
  isLoading: false,
  data: [], // To store the list of favorites
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 0,
    totalRecords: 0
  },
  blogsByCategory: {}, // <- store blogs by category
  error: null
}

export const fetchAllBlogThunk = createAsyncThunk(
  'blog/fetchAll',
  async ({ page, limit, category = '' } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs`, {
        params: {
          page,
          limit,
          category
        }
      })

      return {
        data
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchBlogByIdThunk = createAsyncThunk(
    "blog/getById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/blog/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchBlogByCategoryThunk = createAsyncThunk(
  'blogs/fetchByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs`, {
        params: { category }
      });
      return { category, blogs: data.data }; // include category
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllBlogThunk.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchAllBlogThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data.data // Assuming `blogs` key in response
        state.pagination = {
          currentPage: action.payload.data.pagination.currentPage,
          totalPages: action.payload.data.pagination.totalPages,
          pageSize: action.payload.data.pagination.limit,
          totalRecords: action.payload.data.pagination.totalRecords
        }
      })
      .addCase(fetchAllBlogThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Error fetching blogs'
      })

      .addCase(fetchBlogByIdThunk.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchBlogByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data // Assuming `blogs` key in respons
      })
      .addCase(fetchBlogByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Error fetching blogs'
      })

    .addCase(fetchBlogByCategoryThunk.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchBlogByCategoryThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      const { category, blogs } = action.payload;
      state.blogsByCategory[category] = blogs;
    })
    .addCase(fetchBlogByCategoryThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Error fetching blogs by category";
    });

  }
})

export default blogSlice.reducer
