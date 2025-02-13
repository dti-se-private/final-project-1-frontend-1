import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery, OneRequest, ResponseBody } from "@/src/stores/apis";

export interface AccountPermissionResponse {
    account_id: string;
    permissions: string[];
}

export const accountPermissionApi = createApi({
    reducerPath: "accountPermissionApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/account-permissions`
    }),
    endpoints: (builder) => ({
        getPermissions: builder.query<ResponseBody<AccountPermissionResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: ``,
                    method: "GET",
                });
                if (result.error) {
                    return { error: result.error };
                }
                return { data: result.data as ResponseBody<AccountPermissionResponse> };
            }
        }),
    })
});

export const { useGetPermissionsQuery } = accountPermissionApi;