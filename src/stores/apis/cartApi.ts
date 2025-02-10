import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, ResponseBody} from "@/src/stores/apis";
import {ProductResponse} from "@/src/stores/apis/productApi";

export interface CartItemResponse {
    id: string;
    product: ProductResponse;
    quantity: number;
}

export interface CartItemRequest {
    productId: string;
    quantity: number;
}

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/carts`
    }),
    endpoints: (builder) => ({
        getCartItems: builder.query<ResponseBody<CartItemResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`
                ];
                const result = await baseQuery({
                    url: `?${queryParams.join("&")}`,
                    method: "GET"
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<CartItemResponse[]>};
            }
        }),
        addCartItems: builder.mutation<ResponseBody<CartItemResponse>, CartItemRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/add",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<CartItemResponse>};
            }
        }),
        removeCartItems: builder.mutation<ResponseBody<CartItemResponse>, CartItemRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/remove",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<CartItemResponse>};
            }
        }),
    })
});
