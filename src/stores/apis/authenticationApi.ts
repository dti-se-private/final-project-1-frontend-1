import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";
import {Account} from "@/src/stores/apis/accountApi";


export interface RegisterByEmailAndPasswordRequest {
    email: string;
    password: string;
    name: string;
    phone: string;
}

export interface LoginByEmailAndPasswordRequest {
    email: string;
    password: string;
}

export interface Session {
    accountId: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredAt: string;
    refreshTokenExpiredAt: string;
}


export const authenticationApi = createApi({
    reducerPath: "authenticationApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/authentications`
    }),
    endpoints: (builder) => ({
        registerByEmailAndPassword: builder.mutation<ResponseBody<Account>, RegisterByEmailAndPasswordRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/registers/email-password",
                    method: "POST",
                    data: args,
                });
            }
        }),
        loginByEmailAndPassword: builder.query<ResponseBody<Session>, LoginByEmailAndPasswordRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: "/logins/email-password",
                    method: "POST",
                    data: args,
                });
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

