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

export interface LoginByInternalRequest {
    email: string;
    password: string;
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
        registerByEmailAndPassword: builder.mutation<ResponseBody<AccountResponse>, RegisterByInternalRequest>({
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
        loginByEmailAndPassword: builder.query<ResponseBody<Session>, LoginByInternalRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/logins/internal",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<AccountResponse>};
            }
        }),
        logout: builder.query<ResponseBody<null>, Session>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/logouts/session",
                    method: "POST",
                    data: args,
                });
            }
        }),
        refreshSession: builder.query<ResponseBody<Session>, Session>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/refreshes/session",
                    method: "POST",
                    data: args,
                });
            }
        }),
    })
});

