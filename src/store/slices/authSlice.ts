import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../../types';
import {
  authApi,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
} from '../../services/authApi';
import { storage } from '../../utils/storage';

const initialState: AuthState = {
  user: null,
  token: storage.getToken(),
  refreshToken: storage.getRefreshToken(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const [login] = authApi.useLoginMutation();
      const response = await login(credentials).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const [register] = useRegisterMutation();
      const response = await register(userData).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshTokenValue = state.auth.refreshToken;

      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const [refreshToken] = useRefreshTokenMutation();
      const response = await refreshToken(refreshTokenValue).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        throw new Error('No token available');
      }

      const { data: response } = useGetProfileQuery();
      return response;
    } catch (error: any) {
      return rejectWithValue('Authentication check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.clearTokens();
    },
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AuthResponse['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
          state.error = null;
          storage.setTokens(action.payload.token, action.payload.refreshToken);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
          state.error = null;
          storage.setTokens(action.payload.token, action.payload.refreshToken);
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          storage.setTokens(action.payload.token, action.payload.refreshToken);
        }
      )
      .addCase(refreshToken.rejected, state => {
        state.isLoading = false;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        storage.clearTokens();
      });

    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, state => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthStatus.rejected, state => {
        state.isLoading = false;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        storage.clearTokens();
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
