import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";
import {AccountResponse} from "@/src/stores/apis/accountApi";

export interface RegisterByInternalRequest {
    name: string;
    email: string;
    otp: string;
    password: string;
    phone: string;
}

export interface RegisterByExternalRequest {
    credential: string
}

export interface LoginByInternalRequest {
    email: string;
    password: string;
}

export interface LoginByExternalRequest {
    credential: string
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface Session {
    account: AccountResponse
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredAt: Date;
    refreshTokenExpiredAt: Date;
    permissions: string[];
}


export const authenticationApi = createApi({
    reducerPath: "authenticationApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/authentications`
    }),
    endpoints: (builder) => ({
        registerByInternal: builder.mutation<ResponseBody<AccountResponse>, RegisterByInternalRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/registers/internal",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountResponse>};
            }
        }),
        registerByExternal: builder.mutation<ResponseBody<AccountResponse>, RegisterByExternalRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/registers/external",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountResponse>};
            }
        }),
        loginByInternal: builder.mutation<ResponseBody<Session>, LoginByInternalRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/logins/internal",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<Session>};
            }
        }),
        loginByExternal: builder.mutation<ResponseBody<Session>, LoginByExternalRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/logins/external",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<Session>};
            }
        }),
        logout: builder.mutation<ResponseBody<null>, Session>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/logouts/session",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<null>};
            }
        }),
        refreshSession: builder.mutation<ResponseBody<Session>, Session>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/refreshes/session",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<Session>};
            }
        }),
        resetPassword: builder.mutation<ResponseBody<null>, ResetPasswordRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/reset-password",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<null>};
            }
        }),
    })
});

