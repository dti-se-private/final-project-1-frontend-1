import {createSlice} from "@reduxjs/toolkit";

export interface AddressState {
    prevPage: number,
    currentPage: number,
}

export const accountAddressSlice = createSlice({
    name: 'accountAddressSlice',
    initialState: {
        prevPage: 0,
        currentPage: 0
    } as AddressState,
    reducers: {
        setPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.prevPage = prevPage ?? state.currentPage
            state.currentPage = currentPage
        },
    },
});
