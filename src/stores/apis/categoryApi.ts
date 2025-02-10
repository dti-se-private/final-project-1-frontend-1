import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, ResponseBody} from "@/src/stores/apis";

export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
}

export interface CategoryRequest {
    name: string;
    description: string;
}

export const productApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/product-categories`
    }),
    endpoints: (builder) => ({
        getCategories: builder.query<ResponseBody<CategoryResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`,
                    ...args.filters.map(filter => `filters=${filter}`)
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
    })
});
