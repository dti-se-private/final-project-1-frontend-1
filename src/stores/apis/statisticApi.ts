import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface ProductStatisticRequest {
    type: string
    aggregation: string
    period: string
}

export interface ProductStatisticSeriesResponse {
    x: string
    y: number
}

export const statisticApi = createApi({
    reducerPath: "statisticApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/statistics`
    }),
    endpoints: (builder) => ({
        retrieveProductStatistic: builder.query<ResponseBody<ProductStatisticSeriesResponse[]>, ProductStatisticRequest>({
            // @ts-expect-error: Still compatible even in type lint error.
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `type=${args.type}`,
                    `aggregation=${args.aggregation}`,
                    `period=${args.period}`,
                ];
                return baseQuery({
                    url: `/products?${queryParams.join("&")}`,
                    method: "GET"
                });
            }
        }),
    })
});
