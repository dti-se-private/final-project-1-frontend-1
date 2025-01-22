import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface Account {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    image: string;
}

export interface RetrieveOneAccountRequest {
    id: string;
}

export interface PatchOneAccountRequest {
    id: string,
    email: string;
    password: string;
    name: string;
    phone: string;
    image: string;
}

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/accounts`
    }),
    endpoints: (builder) => ({
        retrieveOneById: builder.query<ResponseBody<Account>, RetrieveOneAccountRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/${args.id}`,
                    method: "GET",
                });
            }
        }),
        patchOneById: builder.mutation<ResponseBody<Account>, PatchOneAccountRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                return baseQuery({
                    url: `/${args.id}`,
                    method: "PATCH",
                    data: args,
                });
            }
        }),
    })
});
