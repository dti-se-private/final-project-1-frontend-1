import { createSlice } from "@reduxjs/toolkit";
import { ProductStockStatisticsRequest, StatisticSeriesResponse } from "@/src/stores/apis/productStockStatisticsApi";

export interface ProductStockStatisticsState {
    getProductStockStatisticsRequest: ProductStockStatisticsRequest;
}

export const productStockStatisticsSlice = createSlice({
    name: "productStockStatisticsSlice",
    initialState: {
        getProductStockStatisticsRequest: {
            warehouseIds: undefined,
            productIds: undefined,
            operation: "STOCK_HISTORY", // Default operation
            aggregation: "DAILY",       // Default aggregation
            period: new Date().getFullYear().toString() // Default to current year
        },
    } as ProductStockStatisticsState,
    reducers: {
        // Set the filter parameters for fetching product stock statistics
        setGetProductStockStatisticsRequest: (state, action: { payload: ProductStockStatisticsRequest }) => {
            state.getProductStockStatisticsRequest = {
                ...state.getProductStockStatisticsRequest,
                ...action.payload
            };
        },
    },
});

export const { setGetProductStockStatisticsRequest } = productStockStatisticsSlice.actions;
export default productStockStatisticsSlice.reducer;