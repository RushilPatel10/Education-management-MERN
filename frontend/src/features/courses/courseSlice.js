import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.get('http://localhost:5000/api/courses', config);
    return response.data;
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default courseSlice.reducer; 