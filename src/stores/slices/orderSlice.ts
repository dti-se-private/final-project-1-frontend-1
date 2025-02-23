import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {OrderResponse} from "@/src/stores/apis/orderApi";

export interface OrderState {
    getOrdersRequest: ManyRequest
    getPaymentConfirmationOrdersRequest: ManyRequest
    details?: OrderResponse
}

export const orderSlice = createSlice({
    name: 'orderSlice',
    initialState: {
        getOrdersRequest: {
            page: 0,
            size: 5,
            search: ''
        },
        getPaymentConfirmationOrdersRequest: {
            page: 0,
            size: 5,
            search: ''
        },
        details: undefined
    } as OrderState,
    reducers: {
        setGetOrdersRequest: (state, action) => {
            state.getOrdersRequest = action.payload;
        },
        setGetPaymentConfirmationOrdersRequest: (state, action) => {
            state.getPaymentConfirmationOrdersRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});
