import { apiSlice } from "./apiSlice"
import { USERS_URL } from "../constants"

// One benefit of using Redux Toolkit queries and mutations is that it caches data for you, meaning if nothing has changed then you get the cached data which is much faster.
// Data caches are associated with 'tags' i.e. in our getUsers query we define some tags ['User'] so when RTK Query caches that data, we can invalidate it if we wish so as not to get the cached data on the next request.
// So for example if we update a user we invalidate the cached 'User' data as we should make a fresh request to get the latest data which will include the updated user. The cached data here would not be up to date with the updated user, so we need to invalidate that cache and can do so using the tags we defined.

// It may be worth you having a read of the docs https://redux-toolkit.js.org/rtk-query/api/createApi#providestags and https://redux-toolkit.js.org/rtk-query/api/created-api/api-slice-utils#invalidatetags for more in depth understanding.
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // because we're making POST request, so we use builder.mutatation instead of builder.query
    login: builder.mutation({
      // we need to send to data to this auth endpoint (email, password)
      query: data => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data
      })
    }),
    register: builder.mutation({
      query: data => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST"
      })
    }),
    profile: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data
      })
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5
    }),
    deleteUser: builder.mutation({
      query: userId => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE"
      })
    }),
    getUserDetails: builder.query({
      query: userId => ({
        url: `${USERS_URL}/${userId}`
      }),
      keepUnusedDataFor: 5
    }),
    updateUser: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["User"]
    })
  })
})

// we're gonna be able to dispatch these actions in LoginScreen
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery
} = userApiSlice
