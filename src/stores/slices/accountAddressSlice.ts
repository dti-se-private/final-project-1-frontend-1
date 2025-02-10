import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {AccountAddressResponse} from "@/src/stores/apis/accountAddressApi";

export interface AccountAddressState {
    getAccountAddressesRequest: ManyRequest
    details?: AccountAddressResponse
}

export const accountAddressSlice = createSlice({
    name: 'accountAddressSlice',
    initialState: {
        getAccountAddressesRequest: {
            page: 0,
            size: 10,
            search: ''
        },
        details: undefined
    } as AccountAddressState,
    reducers: {
        setGetAccountAddressesRequest: (state, action) => {
            state.getAccountAddressesRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});
