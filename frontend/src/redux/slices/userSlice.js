import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ role } = {}) => {
    const response = await api.get(role ? `/users?role=${role}` : '/users')
    return response.data
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id) => {
    await api.delete(`/users/${id}`)
    return id
  }
)

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
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload)
      })
  }
})

export default userSlice.reducer 