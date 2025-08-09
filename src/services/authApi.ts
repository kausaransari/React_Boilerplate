import { api } from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['Auth'],
    }),

    refreshToken: builder.mutation<AuthResponse, string>({
      query: refreshToken => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
