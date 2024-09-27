import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../Utils/baseurl';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (newUser) => ({
                url: `${getBaseUrl()}/signup`,
                method: "POST",
                body: newUser,
            })
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url: `${getBaseUrl()}/login`,
                method: "POST",
                body: data,
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: `${getBaseUrl()}/logout`,
                method: "POST",
            })
        }),
        getUser: builder.mutation({
            query: () => ({
                url: "/users",
                method: "GET"
            }),
            refetchOnMount: true,
            invalidatesTags: ["Users"],
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"]
        }),
        updateUserRole: builder.mutation({
            query: (userId, role) => ({
                url: `/users/${userId}`,
                method: "PUT",
                body: { role }
            }),
            fetchOnMount: true,
            invalidatesTags: ["Users"]
        }),
        editProfile: builder.mutation({
            query: (userData) => ({
                url: `/edit-profile`,
                method: "PATCH",
                body: userData,
            }),
        })
    })
})

export const { useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetUserMutation,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useEditProfileMutation } = authApi;








