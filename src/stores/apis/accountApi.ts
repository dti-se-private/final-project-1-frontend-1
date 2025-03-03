import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";

export interface AccountResponse {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    image: string;
    isVerified: boolean;
}

export interface AccountRequest {
    email: string;
    password: string;
    otp: string;
    name: string;
    phone: string;
    image: string;
}

export interface PatchAccountRequest {
    id: string;
    data: AccountRequest;
}

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/accounts`
    }),
    keepUnusedDataFor: 0,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getAccount: builder.query<ResponseBody<AccountResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountResponse>};
            }
        }),
        patchAccount: builder.mutation<ResponseBody<AccountResponse>, PatchAccountRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "PATCH",
                    data: args.data,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountResponse>};
            }
        }),
        getAccountAdmins: builder.query<ResponseBody<AccountResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`
                ];
                const result = await baseQuery({
                    url: `/admins?${queryParams.join("&")}`,
                    method: "GET"
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountResponse[]>};
            }
        }),
    })
});
