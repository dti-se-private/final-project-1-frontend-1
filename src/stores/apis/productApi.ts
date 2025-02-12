import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";
import {CategoryResponse} from "@/src/stores/apis/categoryApi";

export interface ProductResponse {
    id: string;
    category: CategoryResponse;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
}

export interface ProductRequest {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
}


export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/products`
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<ResponseBody<ProductResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`,
                ];
                const result = await baseQuery({
                    url: `?${queryParams.join("&")}`,
                    method: "GET"
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<ProductResponse[]>};
            }
        }),
        getProduct: builder.query<ResponseBody<ProductResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<ProductResponse>};
            }
        }),

        addProduct: builder.mutation<ResponseBody<ProductResponse>, ProductRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/add",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<ProductResponse>};
            }
        }),

        patchProduct: builder.mutation<ResponseBody<ProductResponse>, ProductRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/update",
                    method: "PATCH",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<ProductResponse>};
            }
        }),

        deleteProduct: builder.mutation<ResponseBody<ProductResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "DELETE",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<ProductResponse>};
            }
        }),
    })
});
