import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";

export interface CartState {
    getCartItemsRequest: ManyRequest
}

export const cartSlice = createSlice({
    name: 'cartSlice',
    initialState: {
        getCartItemsRequest: {
            page: 0,
            size: 1000,
            search: ''
        },
    } as CartState,
    reducers: {
        setGetCartItemsRequest: (state, action) => {
            state.getCartItemsRequest = action.payload;
        },
    },
});
