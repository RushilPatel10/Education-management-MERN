import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.get('http://localhost:5000/api/users', config);
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { getState }) => {
    const { token } = getState().auth;
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.post('http://localhost:5000/api/users', userData, config);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      });
  }
});

export default userSlice.reducer; 