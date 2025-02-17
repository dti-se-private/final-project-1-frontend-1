import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {WarehouseAdminResponse} from "@/src/stores/apis/warehouseAdminApi";

export interface WarehouseAdminState {
    getWarehouseAdminRequest: ManyRequest
    details?: WarehouseAdminResponse
}

export const warehouseAdminSlice = createSlice({
    name: 'warehouseAdminSlice',
    initialState: {
        getWarehouseAdminRequest: {
            page: 0,
            size: 10,
            search: ''
        },
        details: undefined
    } as WarehouseAdminState,
    reducers: {
        setGetWarehouseAdminRequest: (state, action) => {
            state.getWarehouseAdminRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});