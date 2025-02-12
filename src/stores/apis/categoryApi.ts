import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest,ResponseBody} from "@/src/stores/apis";
import { body } from "framer-motion/client";

export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
}

export interface CategoryRequest {
    name: string;
    description: string;
}

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/categories`
    }),
    endpoints: (builder) => ({
        getCategories: builder.query<ResponseBody<CategoryResponse[]>, ManyRequest>({
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
                return {data: result.data as ResponseBody<CategoryResponse[]>};
            }
        }),

        getCategory: builder.query<ResponseBody<CategoryResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<CategoryResponse>};
            }
        }),

        addCategory: builder.mutation<ResponseBody<CategoryResponse>, CategoryRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/add",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<CategoryResponse>};
            }
        }),

        patchCategory: builder.mutation<ResponseBody<CategoryResponse>, {id: string} & CategoryRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const {id, ...body} = args;
                const result = await baseQuery({
                    url: `/${id}`,
                    method: "PATCH",
                    data: body,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<CategoryResponse>};
            }
        }),

        deleteCategory: builder.mutation<ResponseBody<CategoryResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "DELETE",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<CategoryResponse>};
            }
        })
    })
});
