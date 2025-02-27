import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ResponseBody} from "@/src/stores/apis";

// Define response interface (adjust according to actual backend response structure)
export interface StatisticSeriesResponse {
    seriesName: string;
    dataPoints: Array<{
        timestamp: string;
        value: number;
    }>;
}

// Define request parameters interface
export interface ProductStockStatisticsRequest {
    warehouseIds?: string[];
    productIds?: string[];
    operation: string;
    aggregation: string;
    period: string;
}

// Create the API service
export const productStockStatisticsApi = createApi({
    reducerPath: "productStockStatisticsApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/statistics`,
    }),
    endpoints: (builder) => ({
        getProductStockStatistics: builder.query<
            ResponseBody<StatisticSeriesResponse[]>,
            ProductStockStatisticsRequest
        >({
            queryFn: async (args, _api, _extraOptions, baseQuery) => {
                const queryParams: string[] = [];

                // Add optional parameters
                if (args.warehouseIds?.length) {
                    queryParams.push(`warehouse_ids=${args.warehouseIds.join(",")}`);
                }
                if (args.productIds?.length) {
                    queryParams.push(`product_ids=${args.productIds.join(",")}`);
                }

                // Add required parameters
                queryParams.push(`operation=${encodeURIComponent(args.operation)}`);
                queryParams.push(`aggregation=${encodeURIComponent(args.aggregation)}`);
                queryParams.push(`period=${encodeURIComponent(args.period)}`);

                const result = await baseQuery({
                    url: `/product-stocks?${queryParams.join("&")}`,
                    method: "GET",
                });

                if (result.error) {
                    return {error: result.error};
                }
                return {
                    data: result.data as ResponseBody<StatisticSeriesResponse[]>
                };
            },
        }),
    }),
});

// Export hook for usage in components
export const {useGetProductStockStatisticsQuery} = productStockStatisticsApi;