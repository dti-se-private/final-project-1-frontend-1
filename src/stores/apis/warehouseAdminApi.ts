import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";
import {WarehouseResponse} from "@/src/stores/apis/warehouseApi";
import {AccountResponse} from "@/src/stores/apis/accountApi";

export interface WarehouseAdminResponse {
    id: string;
    warehouse: WarehouseResponse;
    account: AccountResponse;
}

export interface WarehouseAdminRequest {
    warehouseId: string;
    accountId: string;
}

export interface PatchWarehouseAdminRequest {
    id: string;
    data: WarehouseAdminRequest;
}

export const warehouseAdminApi = createApi({
    reducerPath: "warehouseAdminApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/warehouse-admins`
    }),
    endpoints: (builder) => ({
        getWarehouseAdmins: builder.query<ResponseBody<WarehouseAdminResponse[]>, ManyRequest>({
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
                return {data: result.data as ResponseBody<WarehouseAdminResponse[]>};
            }
        }),
        getWarehouseAdmin: builder.query<ResponseBody<WarehouseAdminResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseAdminResponse>};
            }
        }),
        addWarehouseAdmin: builder.mutation<ResponseBody<WarehouseAdminResponse>, WarehouseAdminRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: ``,
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseAdminResponse>};
            }
        }),
        patchWarehouseAdmin: builder.mutation<ResponseBody<WarehouseAdminResponse>, PatchWarehouseAdminRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "PATCH",
                    data: args.data,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseAdminResponse>};
            }
        }),
        deleteWarehouseAdmin: builder.mutation<ResponseBody<WarehouseAdminResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "DELETE",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<WarehouseAdminResponse>};
            }
        }),
    })
});