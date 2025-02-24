import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, ResponseBody} from "@/src/stores/apis";

// Define the response and request interfaces
export interface WarehouseLedgerResponse {
    id: string;
    productId: string;
    originWarehouseId: string;
    destinationWarehouseId: string;
    quantity: number;
    status: string; // e.g., "PENDING", "APPROVED", "REJECTED"
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface AddMutationRequest {
    productId: string;
    originWarehouseId: string;
    destinationWarehouseId: string;
    quantity: number;
}

export interface ApproveRejectRequest {
    id: string;
}

// Create the API service
export const warehouseLedgerApi = createApi({
    reducerPath: "warehouseLedgerApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/warehouse-ledgers`,
    }),
    keepUnusedDataFor: 0,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        // Fetch all warehouse ledger entries with pagination and filtering
        getWarehouseLedgers: builder.query<ResponseBody<WarehouseLedgerResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`,
                ];
                const result = await baseQuery({
                    url: `?${queryParams.join("&")}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseLedgerResponse[]>};
            },
        }),

        // Add a new stock mutation
        addMutation: builder.mutation<ResponseBody<WarehouseLedgerResponse>, AddMutationRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/mutations/add`,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseLedgerResponse>};
            },
        }),

        // Approve a stock mutation
        approveMutation: builder.mutation<ResponseBody<WarehouseLedgerResponse>, ApproveRejectRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/mutations/approve`,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseLedgerResponse>};
            },
        }),

        // Reject a stock mutation
        rejectMutation: builder.mutation<ResponseBody<WarehouseLedgerResponse>, ApproveRejectRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/mutations/reject`,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseLedgerResponse>};
            },
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetWarehouseLedgersQuery,
    useAddMutationMutation,
    useApproveMutationMutation,
    useRejectMutationMutation,
} = warehouseLedgerApi;