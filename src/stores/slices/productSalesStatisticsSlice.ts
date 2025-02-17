import { createSlice } from "@reduxjs/toolkit";
import { ProductSalesStatisticsRequest } from "@/src/stores/apis/productSalesStatisticsApi";
import { StatisticSeriesResponse } from "@/src/stores/apis/productSalesStatisticsApi";

export interface ProductSalesStatisticsState {
    getProductSalesStatisticsRequest: ProductSalesStatisticsRequest;
}

export const productSalesStatisticsSlice = createSlice({
    name: "productSalesStatisticsSlice",
    initialState: {
        getProductSalesStatisticsRequest: {
            warehouseIds: undefined,
            categoryIds: undefined,
            productIds: undefined,
            aggregation: "sum",
            period: "day"
        },
    } as ProductSalesStatisticsState,
    reducers: {
        // Set the filter parameters for fetching product sales statistics
        setGetProductSalesStatisticsRequest: (state, action: { payload: ProductSalesStatisticsRequest }) => {
            state.getProductSalesStatisticsRequest = {
                ...state.getProductSalesStatisticsRequest,
                ...action.payload
            };
        },
    },
});

export const { setGetProductSalesStatisticsRequest } = productSalesStatisticsSlice.actions;
export default productSalesStatisticsSlice.reducer;