import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {WarehouseResponse} from "@/src/stores/apis/warehouseApi";

export interface WarehouseState {
    getWarehousesRequest: ManyRequest
    getOriginWarehousesRequest: ManyRequest
    getDestinationWarehousesRequest: ManyRequest
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
        getOriginWarehousesRequest: {
            page: 0,
            size: 5,
            search: ''
        },
        getDestinationWarehousesRequest: {
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
        setGetOriginWarehousesRequest: (state, action) => {
            state.getOriginWarehousesRequest = action.payload;
        },
        setGetDestinationWarehousesRequest: (state, action) => {
            state.getDestinationWarehousesRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        }
    },
});