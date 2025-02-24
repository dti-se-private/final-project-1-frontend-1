import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery, ManyRequest, ResponseBody } from "@/src/stores/apis";

// Define response interface based on the Java class
export interface StatisticSeriesResponse {
    label: string;
    value: number;
    // Add other fields from your Java class if needed
}

// Define request parameters interface
export interface ProductSalesStatisticsRequest {
    warehouseIds?: string[];
    categoryIds?: string[];
    productIds?: string[];
    aggregation: "sum" | "average" | "count";
  period: "day" | "week" | "month";
}

// Create the API service
export const productSalesStatisticsApi = createApi({
    reducerPath: "productSalesStatisticsApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/statistics`,
    }),
    keepUnusedDataFor: 0,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getProductSalesStatistics: builder.query<ResponseBody<StatisticSeriesResponse[]>, ProductSalesStatisticsRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [];
                
                if (args.warehouseIds) {
                    queryParams.push(...args.warehouseIds.map(id => `warehouseIds=${id}`));
                }
                if (args.categoryIds) {
                    queryParams.push(...args.categoryIds.map(id => `categoryIds=${id}`));
                }
                if (args.productIds) {
                    queryParams.push(...args.productIds.map(id => `productIds=${id}`));
                }
                if (args.aggregation) {
                    queryParams.push(`aggregation=${args.aggregation}`);
                }
                if (args.period) {
                    queryParams.push(`period=${args.period}`);
                }

                const result = await baseQuery({
                    url: `/product-sales?${queryParams.join("&")}`,
                    method: "GET",
                });
                
                if (result.error) {
                    return { error: result.error };
                }
                return { data: result.data as ResponseBody<StatisticSeriesResponse[]> };
            },
        }),
    }),
});

// Export hooks for usage in components
export const { useGetProductSalesStatisticsQuery } = productSalesStatisticsApi;