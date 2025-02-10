import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {AccountAddressResponse} from "@/src/stores/apis/accountAddressApi";

export interface AccountAddressState {
    getManyRequest: ManyRequest
    details?: AccountAddressResponse
}

export const accountAddressSlice = createSlice({
    name: 'accountAddressSlice',
    initialState: {
        getManyRequest: {
            page: 0,
            size: 10,
            search: ''
        },
        details: undefined
    } as AccountAddressState,
    reducers: {
        setGetManyRequest: (state, action) => {
            state.getManyRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});
