import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {ProductResponse} from "@/src/stores/apis/productApi";

export interface ProductState {
    getProductsRequest: ManyRequest
    details?: ProductResponse
}

export const productSlice = createSlice({
    name: 'productSlice',
    initialState: {
        getProductsRequest: {
            page: 0,
            size: 10,
            search: ''
        },
        details: undefined
    } as ProductState,
    reducers: {
        setGetProductsRequest: (state, action) => {
            state.getProductsRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        },
    },
});