import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {WarehouseResponse} from "@/src/stores/apis/warehouseApi";

export interface WarehouseState {
    getWarehousesRequest: ManyRequest
    details?: WarehouseResponse
}

export const warehouseSlice = createSlice({
    name: 'warehouseSlice',
    initialState: {
        getWarehousesRequest: {
            page: 0,
            size: 5,
            search: ''
        },
        details: undefined
    } as WarehouseState,
    reducers: {
        setGetWarehousesRequest: (state, action) => {
            state.getWarehousesRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});