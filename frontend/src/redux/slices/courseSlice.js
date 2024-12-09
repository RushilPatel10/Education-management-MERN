import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await api.get('/courses')
    return response.data
  }
)

export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData) => {
    const response = await api.post('/courses', courseData)
    return response.data
  }
)

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, ...courseData }) => {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  }
)

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id) => {
    await api.delete(`/courses/${id}`)
    return id
  }
)

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
        state.loading = true
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload)
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id)
        if (index !== -1) {
          state.courses[index] = action.payload
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload)
      })
  }
})

export default courseSlice.reducer 