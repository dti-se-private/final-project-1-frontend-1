import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {WarehouseAdminResponse} from "@/src/stores/apis/warehouseAdminApi";

export interface WarehouseAdminState {
    getWarehouseAdminsRequest: ManyRequest
    details?: WarehouseAdminResponse
}

export const warehouseAdminSlice = createSlice({
    name: 'warehouseAdminSlice',
    initialState: {
        getWarehouseAdminsRequest: {
            page: 0,
            size: 5,
            search: ''
        },
        details: undefined
    } as WarehouseAdminState,
    reducers: {
        setGetWarehouseAdminsRequest: (state, action) => {
            state.getWarehouseAdminsRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});