import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface StatisticRequest {
    type: string
    aggregation: string
    period: string
}

export interface StatisticSeriesResponse {
    x: string
    y: number
}

export const statisticApi = createApi({
    reducerPath: "statisticApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/statistics`
    }),
    endpoints: (builder) => ({
        retrieveProductStatistic: builder.query<ResponseBody<StatisticSeriesResponse[]>, StatisticRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `type=${args.type}`,
                    `aggregation=${args.aggregation}`,
                    `period=${args.period}`,
                ];
                const result = await baseQuery({
                    url: `/products?${queryParams.join("&")}`,
                    method: "GET"
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<StatisticSeriesResponse[]>};
            }
        }),
    })
});
