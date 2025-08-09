import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { storage } from '../utils/storage';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  prepareHeaders: headers => {
    const token = storage.getToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshToken = storage.getRefreshToken();
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store the new token
        const { token, refreshToken: newRefreshToken } =
          refreshResult.data as any;
        storage.setTokens(token, newRefreshToken);

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        storage.clearTokens();
        window.location.href = '/login';
      }
    } else {
      // No refresh token, logout user
      storage.clearTokens();
      window.location.href = '/login';
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
});
