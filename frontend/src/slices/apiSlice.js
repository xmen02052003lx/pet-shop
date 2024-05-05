// this is the parent (boilerplate) to our other API slices that dealing with asynchronous request
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../constants"

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL })

// async function baseQueryWithAuth(args, api, extra) {
//     const result = await baseQuery(args, api, extra);
//     // Dispatch the logout action on 401.
//     if (result.error && result.error.status === 401) {
//       api.dispatch(logout());
//     }
//     return result;
//   }

export const apiSlice = createApi({
  //   baseQuery: baseQueryWithAuth, // Use the customized baseQuery
  baseQuery,
  tagTypes: ["Product", "Order", "User"], // define the tag of types of data fetching from api
  endpoints: builder => ({})
})
