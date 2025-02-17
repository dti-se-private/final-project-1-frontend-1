import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";
import {ProductResponse} from "@/src/stores/apis/productApi";
import {WarehouseResponse} from "@/src/stores/apis/warehouseApi";

export interface WarehouseProductResponse {
    id: string;
    warehouse: WarehouseResponse;
    product: ProductResponse;
    quantity: number;
}

export interface WarehouseProductRequest {
    warehouseId: string;
    productId: string;
    quantity: number;
}

export interface PatchWarehouseProductRequest {
    id: string;
    data: WarehouseProductRequest;
}

export const warehouseProductApi = createApi({
    reducerPath: "warehouseProductApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/warehouse-products`
    }),
    endpoints: (builder) => ({
        getWarehouseProducts: builder.query<ResponseBody<WarehouseProductResponse[]>, ManyRequest>({
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
                return {data: result.data as ResponseBody<WarehouseProductResponse[]>};
            }
        }),
        getWarehouseProduct: builder.query<ResponseBody<WarehouseProductResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseProductResponse>};
            }
        }),
        addWarehouseProduct: builder.mutation<ResponseBody<WarehouseProductResponse>, WarehouseProductRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: ``,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseProductResponse>};
            }
        }),
        patchWarehouseProduct: builder.mutation<ResponseBody<WarehouseProductResponse>, PatchWarehouseProductRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "PATCH",
                    data: args.data,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseProductResponse>};
            }
        }),
        deleteWarehouseProduct: builder.mutation<ResponseBody<WarehouseProductResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "DELETE",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseProductResponse>};
            }
        }),
    })
});