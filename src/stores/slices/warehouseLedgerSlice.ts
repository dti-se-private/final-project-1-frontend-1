import { createSlice } from "@reduxjs/toolkit";
import { ManyRequest } from "@/src/stores/apis";
import { WarehouseLedgerResponse } from "@/src/stores/apis/warehouseLedgerApi";

export interface WarehouseLedgerState {
    getWarehouseLedgersRequest: ManyRequest;
    details?: WarehouseLedgerResponse;
}

export const warehouseLedgerSlice = createSlice({
    name: "warehouseLedgerSlice",
    initialState: {
        getWarehouseLedgersRequest: {
            page: 0,
            size: 10,
            search: "",
        },
        details: undefined,
    } as WarehouseLedgerState,
    reducers: {
        // Set the pagination and search request for fetching warehouse ledgers
        setGetWarehouseLedgersRequest: (state, action) => {
            state.getWarehouseLedgersRequest = action.payload;
        },

        // Set the details of a specific warehouse ledger entry
        setDetails: (state, action) => {
            state.details = action.payload;
        },
    },
});

export const { setGetWarehouseLedgersRequest, setDetails } = warehouseLedgerSlice.actions;
export default warehouseLedgerSlice.reducer;