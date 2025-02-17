import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {WarehouseProductResponse} from "@/src/stores/apis/warehouseProductApi";

export interface WarehouseProductState {
    getWarehouseProductsRequest: ManyRequest
    details?: WarehouseProductResponse
}

export const warehouseProductSlice = createSlice({
    name: 'warehouseProductSlice',
    initialState: {
        getWarehouseProductsRequest: {
            page: 0,
            size: 10,
            search: ''
        },
        details: undefined,
    } as WarehouseProductState,
    reducers: {
        setGetWarehouseProductsRequest: (state, action) => {
            state.getWarehouseProductsRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
})