import { PRODUCTS_URL } from "../constants"
import { apiSlice } from "./apiSlice" // this slice dealding with asynchronous request so we need apiSlice (createApi)

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // with this, we dont need to use fetch/axios (which is cool in my opinion)
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        // because we want this arrow function return an object so: ({....})
        // this is a query so GET request
        url: PRODUCTS_URL,
        //The query to our backend is constructed for us by using RTK Query.
        // So while we never actually write a request to /api/products?pageNumber=2
        // RTK Query constructs that url for us when we pass a params object to the Query.
        params: { keyword, pageNumber }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"]
    }),
    getProductDetails: builder.query({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`
      }),
      keepUnusedDataFor: 5
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: "POST"
      }),
      invalidatesTags: ["Product"] // stop it from being cached so we'll have fresh data
    }),
    updateProduct: builder.mutation({
      query: data => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Products"]
    }),
    uploadProductImage: builder.mutation({
      query: data => ({
        url: `/api/upload`,
        method: "POST",
        body: data
      })
    }),
    deleteProduct: builder.mutation({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE"
      }),
      providesTags: ["Product"]
    }),
    createReview: builder.mutation({
      query: data => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Product"]
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5
    })
  })
})

// this is a convention: when it is a query => "use" + query's name + "Query"
// this is what we bring into our component whenever we want to use this and fetch our data
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery
} = productsApiSlice
