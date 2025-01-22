import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";


export interface RetrieveProductResponse {
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
}

export interface SearchProductRequest {
    page: number;
    size: number;
    search: string;
    filters: string[];
}

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/products`
    }),
    endpoints: (builder) => ({
        searchProducts: builder.query<ResponseBody<RetrieveProductResponse[]>, SearchProductRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`,
                    ...args.filters.map(filter => `filters=${filter}`)
                ];
                return baseQuery({
                    url: `?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
        retrieveProduct: builder.query<ResponseBody<RetrieveProductResponse>, { id: string }>({
            query: ({id: id}) => ({
                url: `/${id}`,
                method: "GET"
            }),
        }),
    })
});
