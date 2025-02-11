import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {ProductResponse} from "@/src/stores/apis/productApi";
import {CategoryResponse} from "@/src/stores/apis/categoryApi";

export interface ProductState {
    getProductsRequest: ManyRequest
    getCategoriesRequest: ManyRequest
    details?: ProductResponse
    category?: CategoryResponse
}

export const productSlice = createSlice({
    name: 'productSlice',
    initialState: {
        category: undefined,
        getProductsRequest: {
            page: 0,
            size: 10,
            search: ''
        },
        getCategoriesRequest: {
            page: 0,
            size: 10,
            search: ''
        },
        details: undefined,
    } as ProductState,
    reducers: {
        setGetProductsRequest: (state, action) => {
            state.getProductsRequest = action.payload;
        },
        setGetCategoriesRequest: (state, action) => {
            state.getCategoriesRequest = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});
