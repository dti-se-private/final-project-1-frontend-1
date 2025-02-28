import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";
import {WarehouseProductResponse} from "@/src/stores/apis/warehouseProductApi";

export interface WarehouseLedgerResponse {
    id: string;
    productId: string;
    originWarehouseProduct: WarehouseProductResponse;
    destinationWarehouseProduct: WarehouseProductResponse;
    originPreQuantity: number;
    originPostQuantity: number;
    destinationPreQuantity: number;
    destinationPostQuantity: number;
    status: string;
    time: string;
}

export interface AddMutationRequest {
    productId: string;
    originWarehouseId: string;
    destinationWarehouseId: string;
    quantity: number;
}

export interface ApprovalMutationRequest {
    warehouseLedgerId: string;
}

export const warehouseLedgerApi = createApi({
    reducerPath: "warehouseLedgerApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/warehouse-ledgers`,
    }),
    keepUnusedDataFor: 0,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getMutationRequests: builder.query<ResponseBody<WarehouseLedgerResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`,
                ];
                const result = await baseQuery({
                    url: `/mutations?${queryParams.join("&")}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseLedgerResponse[]>};
            },
        }),
        getMutationRequest: builder.query<ResponseBody<WarehouseLedgerResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/mutations/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseLedgerResponse>};
            },
        }),
        addMutationRequest: builder.mutation<ResponseBody<void>, AddMutationRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/mutations/add`,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<void>};
            },
        }),
        approveMutationRequest: builder.mutation<ResponseBody<void>, ApprovalMutationRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/mutations/approve`,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<void>};
            },
        }),
        rejectMutationRequest: builder.mutation<ResponseBody<void>, ApprovalMutationRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/mutations/reject`,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<void>};
            },
        }),
    }),
});
