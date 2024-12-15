import { createContext, useContext, useReducer, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'AUTH_ERROR', payload: 'No token found' });
        return;
      }

      try {
        const userData = await ApiService.verifyToken();
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData } });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({ type: 'AUTH_ERROR', payload: error.message });
      }
    };

    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 