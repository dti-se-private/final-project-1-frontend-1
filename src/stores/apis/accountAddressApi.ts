import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";

export interface AccountAddressResponse {
    id: string;
    name: string;
    address: string;
    location: string;
    isPrimary: boolean;
}

export interface AccountAddressRequest {
    name: string;
    address: string;
    location: string;
    isPrimary: boolean;
}

export interface PatchAccountAddressRequest {
    id: string;
    data: AccountAddressRequest;
}

export const accountAddressApi = createApi({
    reducerPath: "accountAddressApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/account-addresses`
    }),
    keepUnusedDataFor: 0,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getAccountAddresses: builder.query<ResponseBody<AccountAddressResponse[]>, ManyRequest>({
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
                return {data: result.data as ResponseBody<AccountAddressResponse[]>};
            }
        }),
        getAccountAddress: builder.query<ResponseBody<AccountAddressResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountAddressResponse>};
            }
        }),
        addAccountAddress: builder.mutation<ResponseBody<AccountAddressResponse>, AccountAddressRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountAddressResponse>};
            }
        }),
        patchAccountAddress: builder.mutation<ResponseBody<AccountAddressResponse>, PatchAccountAddressRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "PATCH",
                    data: args.data,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountAddressResponse>};
            }
        }),
        deleteAccountAddress: builder.mutation<ResponseBody<void>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "DELETE",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<void>};
            }
        })
    })
});
