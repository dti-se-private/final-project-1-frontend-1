import {createSlice} from "@reduxjs/toolkit";
import {RetrieveProductResponse, SearchProductRequest} from "@/src/stores/apis/productApi";

export interface SearcherState {
    products: RetrieveProductResponse[];
    request: SearchProductRequest;
}

export const searcherSlice = createSlice({
    name: 'searcherSlice',
    initialState: {
        products: [],
        request: {
            page: 0,
            size: 10,
            search: '',
            filters: [],
        }
    } as SearcherState,
    reducers: {
        setRequest: (state, action) => {
            state.request = {...state.request, ...action.payload};
        },
        setProducts: (state, action) => {
            const {products} = action.payload;
            state.products = products;
        }
    },
});
