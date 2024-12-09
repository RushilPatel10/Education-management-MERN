import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching dashboard stats...')
      const response = await api.get('/api/dashboard/stats')
      console.log('Dashboard stats response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats')
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      coursesCount: 0,
      studentsCount: 0,
      teachersCount: 0,
      assignmentsCount: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'An error occurred'
      })
  }
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer 