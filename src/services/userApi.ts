import { api } from './api';
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  PaginatedResponse,
} from '../types';

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<
      PaginatedResponse<User>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `/users?page=${page}&limit=${limit}`,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUserById: builder.query<User, string>({
      query: id => `/users/${id}`,
      providesTags: (result, error, id) => [
        { type: 'User', id, result, error },
      ],
    }),

    createUser: builder.mutation<User, UserCreateRequest>({
      query: userData => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<User, { id: string; data: UserUpdateRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/users/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: args => {
          const id = args?.id;
          return [
            { type: 'User', id },
            { type: 'User', id: 'LIST' },
          ];
        },
      }
    ),

    deleteUser: builder.mutation<void, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
