import { configureStore } from '@reduxjs/toolkit';
import courseReducer from '../features/courses/courseSlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    users: userReducer,
  },
}); 