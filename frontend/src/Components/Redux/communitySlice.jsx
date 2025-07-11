import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/api";
import { useSelector } from "react-redux";

const initialState = {
  isLoading: false,
  data: [], // To store the list of favorites
};

export const fetchAllCommunityThunk = createAsyncThunk(
  "community/fetchAll",
  async ({ category = "" } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/community/allComm`, {
        params: {
          category,
        },
      });
      return {
        data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPostThunk = createAsyncThunk(
  "community/createPost",
  async ({ topicId, description, anonymous }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { accessToken } = auth;

    try {
      const { data } = await api.post(
        "/community/post",
        {
          topicId,
          description,
          anonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error("Error in createPostThunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const fetchCommunityByIdThunk = createAsyncThunk(
  "community/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/community/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTopicByIdThunk = createAsyncThunk(
  "community/topic/getById",
  async ({ id, topicId }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/community/${id}/topics/${topicId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPostByIdThunk = createAsyncThunk(
  "community/post/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/community/${id}/getPost`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postCommLikeThunk = createAsyncThunk(
  "community/post/like",
  async ({ id, comm }, { getState, rejectWithValue }) => {
    const state = getState();
    const { accessToken } = state.auth;

    try {
      const { data } = await api.post(
        `/community/${id}/${comm ? "commLike" : "like"}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error in postCommLikeThunk:", error); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postCommDislikeThunk = createAsyncThunk(
  "community/post/dislike",
  async ({ id, comm }, { getState, rejectWithValue }) => {
    const state = getState();
    const { accessToken } = state.auth;
    try {
      const { data } = await api.post(
        `/community/${id}/${comm ? "commDislike" : "dislike"}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postReplyLikeThunk = createAsyncThunk(
  "community/post/reply/like",
  async ({ commentId, replyId }, { getState, rejectWithValue }) => {
    const state = getState();
    const { accessToken } = state.auth;

    try {
      const { data } = await api.post(
        `/community/${commentId}/${replyId}/replyLike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error in postCommLikeThunk:", error); // Log the error
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postReplyDislikeThunk = createAsyncThunk(
  "community/post/reply/dislike",
  async ({ commentId, replyId }, { getState, rejectWithValue }) => {
    const state = getState();
    const { accessToken } = state.auth;
    try {
      const { data } = await api.post(
        `/community/${commentId}/${replyId}/replyDislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postCommentThunk = createAsyncThunk(
  "community/post/comment",
  async ({ id, comment, isAnonymous }, { getState, rejectWithValue }) => {
    const state = getState();
    const { accessToken } = state.auth;
    try {
      const { data } = await api.post(
        `/community/${id}/comment`,
        {
          comment,
          isAnonymous
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const replyPostReplyThunk = createAsyncThunk(
  "community/replyComment",
  async ({ postId, commentId, reply }, { getState, rejectWithValue }) => {
    const { state } = getState();
    const { accessToken } = state.auth;

    try {
      const response = await api.post(
        `/community/${postId}/comments/${commentId}/replies`,
        { reply }, // 👈 body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 👈 correct placement
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Reply failed");
    }
  }
);

export const replyCommentThunk = createAsyncThunk(
  "community/post/replyComment",
  async ({ id, comment, to }, { getState, rejectWithValue }) => {
    const state = getState();
    const { accessToken } = state.auth;
    try {
      const { data } = await api.post(
        `/community/${id}/addReply`,
        {
          replyText: comment,
          to,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postCommentLikeThunk = createAsyncThunk(
  "community/postCommentLike",
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.post(
        `/community/post/${postId}/comment/${commentId}/like`,
        {
          userId: auth.user._id,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postCommentDislikeThunk = createAsyncThunk(
  "community/postCommentDislike",
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.post(
        `/community/post/${postId}/comment/${commentId}/dislike`,
        {
          userId: auth.user._id,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "community/post/delComment",
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { accessToken } = state.auth; // Get access token from state

      const { data, status } = await api.delete(
        `/community/${postId}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return { data, status }; // Return the response data
    } catch (error) {
      console.error("Error deleting card:", error.message);
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

export const deleteReplyThunk = createAsyncThunk(
  "community/post/delComment/reply",
  async ({ postId, commentId, replyId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { accessToken } = state.auth; // Get access token from state

      const { data, status } = await api.delete(
        `/community/${postId}/comment/${commentId}/reply/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token for authentication
          },
        }
      );
      return { data, status }; // Return the response data
    } catch (error) {
      console.error("Error deleting card:", error.message);
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

export const editCommentThunk = createAsyncThunk(
  "community/post/editComment",
  async ({ postId, commentId, comment }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { accessToken } = state.auth; // Get access token from state

      const { data, status } = await api.put(
        `/community/${postId}/comment/${commentId}`,
        { comment: comment }, // Send the comment in the body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Use JSON content type here
          },
        }
      );

      return { data, status }; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Handle error
    }
  }
);

export const editReplyThunk = createAsyncThunk(
  "community/post/editReply",
  async (
    { postId, commentId, comment, replyId },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const { accessToken } = state.auth; // Get access token from state

      const { data, status } = await api.put(
        `/community/${postId}/comment/${commentId}/reply/${replyId}`,
        { reply: comment }, // Send the comment in the body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Use JSON content type here
          },
        }
      );

      return { data, status }; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Handle error
    }
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCommunityThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCommunityThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data.data; // Assuming `blogs` key in response
      })
      .addCase(fetchAllCommunityThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error fetching community";
      })

      .addCase(fetchCommunityByIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCommunityByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data; // Assuming `blogs` key in respons
      })
      .addCase(fetchCommunityByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error fetching community";
      })

      .addCase(fetchTopicByIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTopicByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data; // Assuming `blogs` key in respons
      })
      .addCase(fetchTopicByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error fetching topic";
      })

      .addCase(fetchPostByIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPostByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload?.data; // Assuming `blogs` key in respons
      })
      .addCase(fetchPostByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error fetching topic";
      })

      .addCase(postCommLikeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postCommLikeThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(postCommLikeThunk.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(postCommDislikeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postCommDislikeThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(postCommDislikeThunk.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(postReplyLikeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postReplyLikeThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(postReplyLikeThunk.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(postReplyDislikeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postReplyDislikeThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(postReplyDislikeThunk.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(postCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postCommentThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(postCommentThunk.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(replyCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(replyCommentThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(replyCommentThunk.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCommentThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCommentThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(deleteReplyThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReplyThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReplyThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(editCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editCommentThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editCommentThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(editReplyThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editReplyThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editReplyThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default communitySlice.reducer;
