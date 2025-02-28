import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {WarehouseLedgerResponse} from "@/src/stores/apis/warehouseLedgerApi";

export interface WarehouseLedgerState {
    getMutationRequestsRequest: ManyRequest;
    details?: WarehouseLedgerResponse;
}

export const warehouseLedgerSlice = createSlice({
    name: "warehouseLedgerSlice",
    initialState: {
        getMutationRequestsRequest: {
            page: 0,
            size: 5,
            search: "",
        },
        details: undefined,
    } as WarehouseLedgerState,
    reducers: {
        setGetMutationRequestsRequest: (state, action) => {
            state.getMutationRequestsRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        },
    },
});
