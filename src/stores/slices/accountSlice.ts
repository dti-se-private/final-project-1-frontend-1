import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {AccountResponse} from "@/src/stores/apis/accountApi";

export interface AccountState {
    getAccountAdminsRequest: ManyRequest
    details?: AccountResponse
}

export const accountSlice = createSlice({
    name: 'accountSlice',
    initialState: {
        getAccountAdminsRequest: {
            page: 0,
            size: 5,
            search: ''
        },
        details: undefined
    } as AccountState,
    reducers: {
        setGetAccountAdminsRequest: (state, action) => {
            state.getAccountAdminsRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});
