import {createSlice} from "@reduxjs/toolkit";
import {ProductResponse} from "@/src/stores/apis/productApi";
import {GetManyRequest} from "@/src/stores/apis";

export interface SearcherState {
    products: ProductResponse[];
    request: GetManyRequest;
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
