import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

export interface ProductStockStatisticRequest {
    productIds: string[]
    operation: string
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
        getProductStock: builder.query<ResponseBody<StatisticSeriesResponse[]>, ProductStockStatisticRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    args.productIds.map((productId) => `productIds=${productId}`).join("&"),
                    `operation=${args.operation}`,
                    `aggregation=${args.aggregation}`,
                    `period=${args.period}`,
                ];
                const result = await baseQuery({
                    url: `/product-stocks?${queryParams.join("&")}`,
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
