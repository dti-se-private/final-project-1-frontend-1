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
            size: 10,
            search: ''
        },
    } as orderSlice,
    reducers: {
        setGetOrdersRequest: (state, action) => {
            state.getOrdersRequest = action.payload;
        },
    },
});
