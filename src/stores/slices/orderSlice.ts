import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";

export interface OrderState {
    getOrdersRequest: ManyRequest
}

export const orderSlice = createSlice({
    name: 'orderSlice',
    initialState: {
        getOrdersRequest: {
            page: 0,
            size: 5,
            search: ''
        },
    } as OrderState,
    reducers: {
        setGetOrdersRequest: (state, action) => {
            state.getOrdersRequest = action.payload;
        },
    },
});
