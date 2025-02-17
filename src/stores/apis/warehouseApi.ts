import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";

export interface WarehouseResponse {
    id: string;
    name: string;
    description: string;
    location: string;
}

export interface WarehouseRequest {
    name: string;
    description: string;
    location: string;
}

export interface PatchWarehouseRequest {
    id: string;
    data: WarehouseRequest;
}

export const warehouseApi = createApi({
    reducerPath: "warehouseApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/warehouses`
    }),
    endpoints: (builder) => ({
        getWarehouses: builder.query<ResponseBody<WarehouseResponse[]>, ManyRequest>({
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
                return {data: result.data as ResponseBody<WarehouseResponse[]>};
            }
        }),
        getWarehouse: builder.query<ResponseBody<WarehouseResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseResponse>};
            }
        }),
        addWarehouse: builder.mutation<ResponseBody<WarehouseResponse>, WarehouseRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: ``,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseResponse>};
            }
        }),
        patchWarehouse: builder.mutation<ResponseBody<WarehouseResponse>, PatchWarehouseRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "PATCH",
                    data: args.data,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseResponse>};
            }
        }),
        deleteWarehouse: builder.mutation<ResponseBody<WarehouseResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "DELETE",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseResponse>};
            }
        }),
    })
});